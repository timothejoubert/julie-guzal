import { joinURL } from 'ufo'
import { asImageSrc, isFilled } from '@prismicio/client'
import type { ImageField } from '@prismicio/client'
import { getText } from '~/utils/prismic/prismic-rich-field.js'
import { getJsonLdScriptContent } from '~/utils/structured-data'
import type { ReachableDocument } from '~/types/api'
import type { SettingsDocument } from '~/prismicio-types'

const OG_IMAGE_WIDTH = 1280
const OG_IMAGE_HEIGHT = 720
// public/share.jpg
const FALLBACK_IMAGE = { path: 'share.jpg', width: 1440, height: 720 }

const PERSON = { name: 'Julie Guzal', jobTitle: 'Art director' }

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
    canonicalUrl: string
    description?: string
    imageUrl?: string
}) {
    const { webResponse, settings, siteUrl, siteName, canonicalUrl, description, imageUrl } = options
    const personId = joinURL(siteUrl, '#person')

    if (webResponse?.type === 'home_page') {
        const sameAs = settings?.data?.socials
            ?.map(social => social.external_url)
            .filter((url): url is string => !!url && /^https?:\/\//.test(url))

        return {
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type': 'WebSite',
                    '@id': joinURL(siteUrl, '#website'),
                    'url': canonicalUrl,
                    'name': siteName,
                    'description': description || settings?.data?.site_description,
                    'inLanguage': 'en',
                    'publisher': { '@id': personId },
                },
                {
                    '@type': 'Person',
                    '@id': personId,
                    'name': PERSON.name,
                    'jobTitle': PERSON.jobTitle,
                    'url': canonicalUrl,
                    'sameAs': sameAs,
                },
            ],
        }
    }

    if (webResponse?.type === 'project_page') {
        return {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            'name': webResponse.data.title,
            'url': canonicalUrl,
            'image': imageUrl,
            'description': description,
            'dateCreated': webResponse.data.creation_date,
            'creator': { '@type': 'Person', '@id': personId, 'name': PERSON.name },
        }
    }
}

export async function usePrismicSeoMeta(webResponse?: ReachableDocument) {
    const settingDocument = await usePrismicSettingsDocument()
    const runtimeConfig = useRuntimeConfig()
    const siteUrl = runtimeConfig.public.site.url
    const siteName = settingDocument?.data?.site_name || runtimeConfig.public.site.name

    const title = getSeoTitle(webResponse, siteName)
    const description = webResponse?.data?.meta_description || getDescription(webResponse)
    const image = getImage(webResponse, siteUrl)
    const canonicalUrl = usePrismicCanonicalUrl(webResponse)

    useSeoMeta({
        title,
        description,
        ogType: 'website',
        ogLocale: 'en_US',
        ogSiteName: siteName,
        ogTitle: title,
        ogDescription: description,
        ogUrl: canonicalUrl,
        ogImage: image.url,
        ogImageWidth: image.width,
        ogImageHeight: image.height,
        ogImageAlt: image.alt,
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: image.url,
        twitterImageAlt: image.alt,
    })

    const structuredData = getStructuredData({
        webResponse,
        settings: settingDocument,
        siteUrl,
        siteName,
        canonicalUrl,
        description,
        imageUrl: image.url,
    })

    if (structuredData) {
        useHead({
            script: [getJsonLdScriptContent(structuredData)],
        })
    }

    return { title, siteName }
}
