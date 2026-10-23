import { joinURL } from 'ufo'
import { asImageSrc, isFilled } from '@prismicio/client'
import type { ImageField } from '@prismicio/client'
import { getText } from '~/utils/prismic/prismic-rich-field.js'
import { truncate } from '~/utils/string/truncate'
import { getJsonLdScriptContent } from '~/utils/structured-data'
import type { ReachableDocument } from '~/types/api'
import type { SettingsDocument } from '~/prismicio-types'

const OG_IMAGE_WIDTH = 1280
const OG_IMAGE_HEIGHT = 720
// public/share.jpg
const FALLBACK_IMAGE = { path: 'share.jpg', width: 1440, height: 720 }

const PERSON = {
    name: 'Julie Guzal',
    jobTitle: 'Art director',
    knowsAbout: ['Art direction', 'Branding', 'Graphic design', 'Interactive design', 'Digital design', 'Photography'],
}

// Prismic dates look like `2026-09-17T13:55:29+0000`: output a standard ISO 8601 string
function toIsoDate(value: string | undefined) {
    return value ? new Date(value).toISOString() : undefined
}

function getDescription(webResponse: ReachableDocument | undefined) {
    const data = webResponse?.data
    if (!data) return

    if ('content' in data && data.content) return getText(data.content)
    else if ('excerpt' in data && data.excerpt) return getText(data.excerpt)
    else if ('description' in data && data.description) return getText(data.description)
    else if ('short_description' in data && data.short_description) return getText(data.short_description)

    return
}

/**
 * Document title, "%s | <site name>" except for the home page.
 * `meta_title` wins over `title`, and the site name is never appended twice.
 */
export function getSeoTitle(webResponse: ReachableDocument | undefined, siteName: string) {
    const baseTitle = webResponse?.data?.meta_title || (webResponse?.type !== 'home_page' && webResponse?.data?.title)

    if (!baseTitle) return siteName
    if (webResponse?.type === 'home_page' || baseTitle.includes(siteName)) return baseTitle

    return `${baseTitle} | ${siteName}`
}

function getImage(webResponse: ReachableDocument | undefined, siteUrl: string) {
    const data = webResponse?.data
    const field = [data?.meta_image, data && 'image' in data ? data.image : undefined]
        .find((f): f is ImageField => isFilled.image(f))

    if (field) {
        return {
            url: asImageSrc(field, { w: OG_IMAGE_WIDTH, h: OG_IMAGE_HEIGHT, fit: 'crop', q: 75 }) || undefined,
            width: OG_IMAGE_WIDTH,
            height: OG_IMAGE_HEIGHT,
            alt: field.alt || undefined,
        }
    }

    return {
        url: joinURL(siteUrl, FALLBACK_IMAGE.path),
        width: FALLBACK_IMAGE.width,
        height: FALLBACK_IMAGE.height,
        alt: undefined,
    }
}

function getStructuredData(options: {
    webResponse?: ReachableDocument
    settings?: SettingsDocument | null
    siteUrl: string
    siteName: string
    title: string
    canonicalUrl: string
    description?: string
    imageUrl?: string
}) {
    const { webResponse, settings, siteUrl, siteName, title, canonicalUrl, description, imageUrl } = options
    const personId = joinURL(siteUrl, '#person')
    const websiteId = joinURL(siteUrl, '#website')
    const webPage = {
        url: canonicalUrl,
        name: title,
        description: description,
        inLanguage: 'en',
        isPartOf: { '@id': websiteId },
    }
    // Search engines don't resolve @id across pages: each page declares the nodes it references
    const websiteNode = { '@type': 'WebSite', '@id': websiteId, 'url': siteUrl, 'name': siteName }
    const personNode = { '@type': 'Person', '@id': personId, 'name': PERSON.name, 'jobTitle': PERSON.jobTitle, 'url': siteUrl }

    if (webResponse?.type === 'home_page') {
        const sameAs = settings?.data?.socials
            ?.map(social => social.external_url)
            .filter((url): url is string => !!url && /^https?:\/\//.test(url))

        return {
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type': 'WebSite',
                    '@id': websiteId,
                    'url': canonicalUrl,
                    'name': siteName,
                    'description': description || settings?.data?.site_description,
                    'inLanguage': 'en',
                    'publisher': { '@id': personId },
                },
                {
                    '@type': 'ProfilePage',
                    ...webPage,
                    'mainEntity': { '@id': personId },
                },
                {
                    ...personNode,
                    // No description nor image yet: site_description describes the site and the logo isn't a portrait
                    knowsAbout: PERSON.knowsAbout,
                    email: settings?.data?.email ? `mailto:${settings.data.email}` : undefined,
                    sameAs: sameAs,
                },
            ],
        }
    }

    if (webResponse?.type === 'contact_page') {
        return {
            '@context': 'https://schema.org',
            '@graph': [
                { '@type': 'ContactPage', ...webPage, 'about': { '@id': personId } },
                websiteNode,
                personNode,
            ],
        }
    }

    if (webResponse?.type === 'gallery_page' || webResponse?.type === 'lab_page') {
        return {
            '@context': 'https://schema.org',
            '@graph': [
                { '@type': 'CollectionPage', ...webPage, 'author': { '@id': personId } },
                websiteNode,
                personNode,
            ],
        }
    }

    // Archived projects are noindex: no rich data for them
    if (webResponse?.type === 'project_page' && !webResponse.data.archived) {
        const projectTitle = webResponse.data.title
        const breadcrumb = projectTitle && siteUrl && {
            '@type': 'BreadcrumbList',
            'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'Work', 'item': siteUrl },
                { '@type': 'ListItem', 'position': 2, 'name': projectTitle, 'item': canonicalUrl },
            ],
        }

        return {
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type': 'CreativeWork',
                    'name': projectTitle,
                    'url': canonicalUrl,
                    'image': imageUrl,
                    'description': description,
                    'inLanguage': 'en',
                    'dateCreated': webResponse.data.creation_date,
                    'datePublished': toIsoDate(webResponse.first_publication_date),
                    'dateModified': toIsoDate(webResponse.last_publication_date),
                    'isPartOf': { '@id': websiteId },
                    'creator': { '@id': personId },
                },
                breadcrumb || undefined,
                websiteNode,
                personNode,
            ],
        }
    }
}

export async function usePrismicSeoMeta(webResponse?: ReachableDocument) {
    const settingDocument = await usePrismicSettingsDocument()
    const runtimeConfig = useRuntimeConfig()
    const siteUrl = runtimeConfig.public.site.url
    const siteName = settingDocument?.data?.site_name || runtimeConfig.public.site.name

    const title = getSeoTitle(webResponse, siteName)
    const description = truncate(webResponse?.data?.meta_description || getDescription(webResponse) || settingDocument?.data?.site_description || undefined)
    const image = getImage(webResponse, siteUrl)
    const imageAlt = image.alt || title
    const isProject = webResponse?.type === 'project_page' && !webResponse.data.archived
    const canonicalUrl = usePrismicCanonicalUrl(webResponse)

    useSeoMeta({
        title,
        description,
        ogType: isProject ? 'article' : 'website',
        ogLocale: 'en_US',
        ogSiteName: siteName,
        ogTitle: title,
        ogDescription: description,
        ogUrl: canonicalUrl,
        ogImage: image.url,
        ogImageWidth: image.width,
        ogImageHeight: image.height,
        ogImageAlt: imageAlt,
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: image.url,
        twitterImageAlt: imageAlt,
        articlePublishedTime: isProject ? toIsoDate(webResponse.first_publication_date) : undefined,
        articleModifiedTime: isProject ? toIsoDate(webResponse.last_publication_date) : undefined,
    })

    const structuredData = getStructuredData({
        webResponse,
        settings: settingDocument,
        siteUrl,
        siteName,
        title,
        canonicalUrl,
        description,
        imageUrl: image.url,
    })

    // Archived projects stay reachable by URL but out of search engines (and of the sitemap, which skips noindex pages)
    if (webResponse?.type === 'project_page' && webResponse.data.archived) {
        useRobotsRule('noindex, follow')
    }

    if (structuredData) {
        useHead({
            script: [getJsonLdScriptContent(structuredData)],
        })
    }

    return { title, siteName }
}
