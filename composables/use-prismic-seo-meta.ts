import { joinURL } from 'ufo'
import type { PrismicWebResponse } from '~/composables/use-prismic-fetch-page'
import { getText } from '~/utils/prismic/prismic-rich-field'

export async function usePrismicSeoMeta(webResponse?: PrismicWebResponse) {
    const nuxtApp = useNuxtApp()
    const settingDocument = await usePrismicSettingsDocument()
    const runtimeConfig = useRuntimeConfig()

    const siteName = settingDocument?.data?.site_name || (nuxtApp.$config.siteName as string) || ''
    const title = webResponse?.data?.meta_title || webResponse?.data?.title || siteName
    const description = webResponse?.data?.meta_description || getText(webResponse?.data?.content)
    const apiImgUrl = webResponse?.data?.meta_image?.url || webResponse?.data?.image?.url

    const generateImg = useImage()
    const image = apiImgUrl
        ? generateImg(
                apiImgUrl,
                {
                    fit: 'crop',
                    width: 800,
                },
                {
                    provider: 'imgix',
                },
            )
        : joinURL(runtimeConfig.public.site.url, '/assets/share.jpg')

    const { fullPath } = useRoute()
    const canonicalUrl = joinURL(runtimeConfig.public.site.url, fullPath)

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
