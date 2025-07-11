import { joinURL } from 'ufo'
import { getText } from '~/utils/prismic/prismic-rich-field.js'
import type { ReachableDocument } from '~/types/api'

function getDescription(webResponse: ReachableDocument | undefined) {
    const data = webResponse?.data
    if (!data) return

    if ('content' in data && data.content) return getText(data.content)
    else if ('excerpt' in data && data.excerpt) return getText(data.excerpt)
    else if ('description' in data && data.description) return getText(data.description)
    else if ('short_description' in data && data.short_description) return getText(data.short_description)

    return
}

export async function usePrismicSeoMeta(webResponse?: ReachableDocument) {
    const settingDocument = await usePrismicSettingsDocument()
    const runtimeConfig = useRuntimeConfig()
    const siteUrl = runtimeConfig.public.site.url
    const siteName = settingDocument?.data?.site_name || runtimeConfig.public.site.name

    const title = webResponse?.data?.meta_title || webResponse?.data?.title || siteName
    const description = webResponse?.data?.meta_description || getDescription(webResponse)
    const apiImgUrl = webResponse?.data?.meta_image?.url || webResponse?.data?.image?.url

    const generateImg = useImage()
    const image = apiImgUrl
        ? generateImg(
                apiImgUrl,
                {
                    quality: 75,
                    fit: 'crop',
                    ar: '1280:720',
                    width: 1280,
                },
                {
                    provider: 'imgix',
                },
            )
        : joinURL(siteUrl, 'share.jpg')

    const { fullPath } = useRoute()
    const canonicalUrl = joinURL(siteUrl, fullPath)

    useSeoMeta({
        ogSiteName: siteName,
        ogTitle: title,
        description,
        ogDescription: description,
        twitterDescription: description,
        twitterCard: 'summary',
        twitterTitle: title,
        ogImage: image,
        twitterImage: image,
        ogUrl: canonicalUrl,
    })
}
