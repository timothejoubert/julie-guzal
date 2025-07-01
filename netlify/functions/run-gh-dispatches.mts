import type { Context } from '@netlify/functions'

export default async (request: Request, _context: Context) => {
    console.log('-- netlify function ---')

    if (request.method !== 'POST') {
        return new Response('Invalid HTTP method. Only POST is allowed.', { status: 405 })
    }

    const githubToken = Netlify.env.get('NUXT_GITHUB_USER_TOKEN') || process.env.NUXT_GITHUB_USER_TOKEN

    if (!githubToken) {
        console.error('Missing secrets in environment.')
        return new Response('Server misconfigured: missing secrets.', { status: 500 })
    }

    try {
        const data = await request.json()

        // Check payload type
        // Sometime body secret isn't a string
        if (!data || typeof data !== 'object') {
            return new Response('Invalid JSON payload.', { status: 400 })
        }

        const dispatchRes = await fetch('https://api.github.com/repos/timothejoubert/julie-guzal/dispatches', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `token ${githubToken}`,
                'User-Agent': 'julie-guzal/1.0',
            },
            body: JSON.stringify({
                event_type: 'netlify_function_publish_trigger',
                client_payload: {
                    unit: false,
                    integration: true,
                },
            }),
        })

        if (!dispatchRes.ok) {
            const errorText = await dispatchRes.text()
            console.error('GitHub dispatch failed:', errorText)
            return new Response('GitHub dispatch failed: ' + errorText, { status: 500 })
        }

        return new Response('GitHub dispatch triggered successfully with event_type: netlify_function_publish_trigger', { status: 200 })
    }
    catch (error) {
        console.error('Error handling request:', error)
        return new Response('Internal server error.', { status: 500 })
    }
}
