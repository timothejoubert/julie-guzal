import { joinURL } from 'ufo'
import { asText, createClient, filter } from '@prismicio/client'
import { repositoryName } from '#root/prismic.config.json'
import { getDocumentRoutePath } from '#root/utils/prismic/route-resolver'
import { truncate } from '#root/utils/string/truncate'

// Link text must not break the `[text](url)` syntax
const escapeLinkText = (value: string) => value.replace(/\s+/g, ' ').replace(/[[\]]/g, '\\$&')

// https://llmstxt.org: plain Markdown summary of the site for AI assistants. Prerendered at build time.
export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig(event)
    const siteUrl = runtimeConfig.public.site.url
    // Absolute URLs when the site URL is set (production builds), root-relative otherwise
    const pageUrl = (type: Parameters<typeof getDocumentRoutePath>[0], uid = '') => joinURL(siteUrl || '/', getDocumentRoutePath(type) || '', uid)
    const client = createClient(repositoryName)

    const [settings, projects] = await Promise.all([
        client.getSingle('settings'),
        client.getAllByType('project_page', {
            filters: [filter.at('my.project_page.archived', false)],
            orderings: [
                { field: 'my.project_page.order_date', direction: 'desc' },
                { field: 'my.project_page.creation_date', direction: 'desc' },
            ],
            fetch: ['project_page.title', 'project_page.content', 'project_page.creation_date'],
        }),
    ])

    const siteName = settings.data.site_name || runtimeConfig.public.site.name
    const projectLines = projects.map((project) => {
        const year = project.data.creation_date?.slice(0, 4)
        // The content often starts with the project title as a heading: don't repeat it
        const content = asText(project.data.content, { separator: ' ' }).trim()
        const description = truncate(project.data.title && content.startsWith(project.data.title) ? content.slice(project.data.title.length) : content, 200)
        const title = escapeLinkText([project.data.title || project.uid, year && `(${year})`].filter(Boolean).join(' '))

        return `- [${title}](${pageUrl('project_page', project.uid)})${description ? `: ${description}` : ''}`
    })

    const lines = [
        `# ${siteName}`,
        '',
        `> ${truncate(settings.data.site_description || undefined, 300) || 'Art director portfolio.'}`,
        '',
        '## Work',
        '',
        ...projectLines,
        '',
        '## Pages',
        '',
        `- [Work](${pageUrl('home_page')}): selected projects`,
        `- [Photo](${pageUrl('gallery_page')}): photography`,
        `- [Lab](${pageUrl('lab_page')}): experiments and personal work`,
        `- [Contact](${pageUrl('contact_page')}): about and contact`,
        '',
    ]

    if (settings.data.email) lines.push('## Contact', '', `- Email: ${settings.data.email}`, '')

    setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')

    return lines.join('\n')
})
