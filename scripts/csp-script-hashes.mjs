// Runs after `nuxi generate`: adds the sha256 hash of every inline script of the generated pages
// to the CSP `script-src` of `.output/public/.htaccess`. Browsers that support hashes then ignore
// `'unsafe-inline'`, which stays in `public/.htaccess` as a fallback for the very old ones.
// The hashes change on each build (import map entry, `window.__NUXT__` config), hence this step.
import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const PUBLIC_DIR = '.output/public'
const HTACCESS = join(PUBLIC_DIR, '.htaccess')
// Inline scripts whose content is executed (data blocks such as JSON payloads or JSON-LD are not)
const EXECUTABLE_TYPES = ['', 'module', 'importmap', 'text/javascript', 'application/javascript']
// `script-src 'self'` followed by the hashes of a previous run, if any (keeps the script idempotent)
const SCRIPT_SRC_REGEXP = /script-src 'self'(?: 'sha256-[\w+/=]+')*/g

// Value of an attribute, whether double-quoted, single-quoted or unquoted
function getAttribute(attributes, name) {
    const match = attributes.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>]+))`, 'i'))

    return match ? (match[1] ?? match[2] ?? match[3]) : undefined
}

const files = (await readdir(PUBLIC_DIR, { recursive: true })).filter(file => file.endsWith('.html'))
const hashes = new Set()

for (const file of files) {
    const html = await readFile(join(PUBLIC_DIR, file), 'utf8')

    for (const [, attributes, content] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
        if (getAttribute(attributes, 'src') !== undefined || !content) continue

        const type = getAttribute(attributes, 'type')?.trim().toLowerCase() ?? ''
        if (!EXECUTABLE_TYPES.includes(type)) continue

        hashes.add(`'sha256-${createHash('sha256').update(content).digest('base64')}'`)
    }
}

const htaccess = await readFile(HTACCESS, 'utf8')

if (!htaccess.match(SCRIPT_SRC_REGEXP)) {
    console.error(`[csp] "script-src 'self'" not found in ${HTACCESS}`)
    process.exit(1)
}

await writeFile(HTACCESS, htaccess.replace(SCRIPT_SRC_REGEXP, `script-src 'self' ${[...hashes].join(' ')}`))

console.log(`[csp] ${hashes.size} inline script hashes from ${files.length} pages added to ${HTACCESS}`)
