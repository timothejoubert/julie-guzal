// Local backup of the published Prismic content (`pnpm backup`): writes a dated snapshot of every
// document (raw Content API response) with a manifest of the media they use, and downloads the
// original Prismic files into a shared `assets` folder. Files already downloaded are skipped and
// never removed, so a media deleted from Prismic stays in the backup.
// Drafts, archived documents and unused media library assets are not exposed by the Content API.
import { createClient } from '@prismicio/client'
import { mkdir, rename, rm, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import prismicConfig from '../prismic.config.json' with { type: 'json' }

const BACKUP_DIR = process.env.BACKUP_DIR || 'backups/prismic'
const ASSETS_DIR = join(BACKUP_DIR, 'assets')
// Test mode: only download the first n assets (documents and manifest stay complete)
const ASSETS_LIMIT = Number(process.env.BACKUP_ASSETS_LIMIT) || Infinity
const SNAPSHOT_DIR = join(BACKUP_DIR, 'snapshots', new Date().toISOString().slice(0, 16).replace(':', ''))
// Prismic media hosts: images (served by imgix) and other files (videos, PDF…)
const MEDIA_HOST_REGEXP = /^(images\.prismic\.io|[\w-]+\.cdn\.prismic\.io)$/
const DOWNLOAD_CONCURRENCY = 6

function getMediaUrl(value) {
    if (typeof value?.url !== 'string') return

    const url = URL.parse(value.url)

    return url && MEDIA_HOST_REGEXP.test(url.hostname) ? url : undefined
}

// Walks a document and collects its Prismic media (image fields and their responsive views, rich text
// images, media links) and embeds, with the path of the field that uses them
function collectMedia(document, assets, embeds) {
    const usage = { docId: document.id, type: document.type, uid: document.uid, lang: document.lang }

    function walk(value, path) {
        if (Array.isArray(value)) {
            value.forEach((item, index) => walk(item, `${path}[${index}]`))
            return
        }
        if (!value || typeof value !== 'object') return

        const url = getMediaUrl(value)

        if (url) {
            const fileName = decodeURIComponent(url.pathname.split('/').pop())
            const id = value.id ?? fileName
            const asset = assets.get(id) ?? {
                id,
                file: `assets/${fileName}`,
                // Without imgix parameters (`auto=format,compress`, editor crop…), the original file is served
                url: `${url.origin}${url.pathname}`,
                apiUrl: value.url,
                kind: value.kind ?? 'image',
                width: value.dimensions?.width,
                height: value.dimensions?.height,
                alt: value.alt ?? undefined,
                copyright: value.copyright ?? undefined,
                usedIn: [],
            }

            asset.usedIn.push({ ...usage, path })
            assets.set(id, asset)
        }
        else if (typeof value.embed_url === 'string') {
            const embed = embeds.get(value.embed_url) ?? {
                url: value.embed_url,
                provider: value.provider_name,
                title: value.title,
                thumbnailUrl: value.thumbnail_url,
                html: value.html,
                usedIn: [],
            }

            embed.usedIn.push({ ...usage, path })
            embeds.set(value.embed_url, embed)
            return
        }

        for (const [key, child] of Object.entries(value)) walk(child, path ? `${path}.${key}` : key)
    }

    walk(document.data, 'data')
}

async function getFileSize(path) {
    try {
        return (await stat(path)).size
    }
    catch {
        return undefined
    }
}

// Downloads to a `.part` file first so an interrupted download never looks complete
async function download(asset) {
    const path = join(BACKUP_DIR, asset.file)
    const existingSize = await getFileSize(path)

    if (existingSize !== undefined) return { size: existingSize, downloaded: false }

    const response = await fetch(asset.url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const buffer = Buffer.from(await response.arrayBuffer())
    const partPath = `${path}.part`

    await writeFile(partPath, buffer)
    await rename(partPath, path)

    return { size: buffer.length, downloaded: true }
}

const documents = await createClient(prismicConfig.repositoryName).dangerouslyGetAll({ lang: '*' })
const assets = new Map()
const embeds = new Map()

for (const document of documents) collectMedia(document, assets, embeds)

await mkdir(ASSETS_DIR, { recursive: true })
await mkdir(SNAPSHOT_DIR, { recursive: true })
await writeFile(join(SNAPSHOT_DIR, 'documents.json'), JSON.stringify(documents, null, 2))

const queue = [...assets.values()].slice(0, ASSETS_LIMIT)
const failures = []
let downloadedCount = 0
let totalSize = 0

await Promise.all(Array.from({ length: DOWNLOAD_CONCURRENCY }, async () => {
    for (let asset = queue.shift(); asset; asset = queue.shift()) {
        try {
            const { size, downloaded } = await download(asset)

            asset.size = size
            totalSize += size
            if (downloaded) downloadedCount++
        }
        catch (error) {
            failures.push(asset)
            await rm(join(BACKUP_DIR, `${asset.file}.part`), { force: true })
            console.error(`[backup] ${asset.url}: ${error.message}`)
        }
    }
}))

const manifest = {
    repository: prismicConfig.repositoryName,
    date: new Date().toISOString(),
    documents: documents.length,
    assets: [...assets.values()],
    embeds: [...embeds.values()],
}

await writeFile(join(SNAPSHOT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2))

const limited = ASSETS_LIMIT < assets.size ? `, limited to ${ASSETS_LIMIT}` : ''

console.log(`[backup] ${documents.length} documents, ${downloadedCount} new assets / ${assets.size}${limited} (${Math.round(totalSize / 1e6)} MB), ${embeds.size} embeds → ${SNAPSHOT_DIR}`)

if (failures.length) {
    console.error(`[backup] ${failures.length} assets could not be downloaded`)
    process.exit(1)
}
