import { createHash, timingSafeEqual } from 'node:crypto'
import type { Context } from '@netlify/functions'

const GITHUB_REPOSITORY = 'timothejoubert/julie-guzal'
const GITHUB_API_VERSION = '2022-11-28'
const DISPATCH_EVENT_TYPE = 'netlify_function_publish_trigger'

function getEnv(name: string): string | undefined {
    return Netlify.env.get(name) || process.env[name]
}

// Hash both values so the buffers always have the same length (no length leak)
function isSameSecret(received: string, expected: string): boolean {
    const a = createHash('sha256').update(received).digest()
    const b = createHash('sha256').update(expected).digest()

    return timingSafeEqual(a, b)
}

export default async (request: Request, _context: Context) => {
    if (request.method !== 'POST') {
        return new Response('Invalid HTTP method. Only POST is allowed.', { status: 405 })
    }

    const githubToken = getEnv('NUXT_GITHUB_USER_TOKEN')
    const webhookSecret = getEnv('PRISMIC_WEBHOOK_SECRET')

    if (!githubToken || !webhookSecret) {
        console.error('Missing environment variable(s):', [
            !githubToken && 'NUXT_GITHUB_USER_TOKEN',
            !webhookSecret && 'PRISMIC_WEBHOOK_SECRET',
        ].filter(Boolean).join(', '))
        return new Response('Server misconfigured.', { status: 500 })
    }

    let data: unknown

    try {
        data = await request.json()
    }
    catch {
        return new Response('Invalid JSON payload.', { status: 400 })
    }

    if (!data || typeof data !== 'object') {
        return new Response('Invalid JSON payload.', { status: 400 })
    }

    // Prismic sends the configured webhook secret in the JSON body (`secret` field)
    const payload = data as Record<string, unknown>
    const receivedSecret = payload.secret

    if (typeof receivedSecret !== 'string' || !isSameSecret(receivedSecret, webhookSecret)) {
        return new Response('Unauthorized.', { status: 401 })
    }

    // Forward only non-sensitive information (never the secret)
    const documents = Array.isArray(payload.documents)
        ? payload.documents.filter((id): id is string => typeof id === 'string').slice(0, 50)
        : []

    try {
        const dispatchRes = await fetch(`https://api.github.com/repos/${GITHUB_REPOSITORY}/dispatches`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${githubToken}`,
                'X-GitHub-Api-Version': GITHUB_API_VERSION,
                'User-Agent': 'julie-guzal/1.0',
            },
            body: JSON.stringify({
                event_type: DISPATCH_EVENT_TYPE,
                client_payload: {
                    unit: false,
                    integration: true,
                    prismic_type: typeof payload.type === 'string' ? payload.type : null,
                    documents,
                },
            }),
        })

        if (!dispatchRes.ok) {
            const errorText = await dispatchRes.text()
            console.error(`GitHub dispatch failed (${dispatchRes.status}):`, errorText)
            return new Response('Upstream dispatch failed.', { status: 502 })
        }

        return new Response(`GitHub dispatch triggered with event_type: ${DISPATCH_EVENT_TYPE}`, { status: 200 })
    }
    catch (error) {
        console.error('Error dispatching to GitHub:', error)
        return new Response('Upstream dispatch failed.', { status: 502 })
    }
}
