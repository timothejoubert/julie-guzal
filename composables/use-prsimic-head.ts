import { joinURL } from 'ufo'
import type { PrismicWebResponse } from '~/composables/use-prismic-fetch-page'

/**
 * Canonical URL of the current page, without query string nor hash.
 * Shared by `<link rel="canonical">` and `og:url` so they always match.
 */
export function usePrismicCanonicalUrl(webResponse?: PrismicWebResponse) {
    const route = useRoute()
    const siteUrl = useRuntimeConfig().public.site.url

    return joinURL(siteUrl, webResponse?.url || route.path)
}

export function usePrismicHead(webResponse?: PrismicWebResponse) {
    const nuxtApp = useNuxtApp()
    const runtimeConfig = useRuntimeConfig()

    const { $i18n } = nuxtApp

    useHead({
        htmlAttrs: {
            lang: $i18n.locale.value,
        },
        link: [
            {
                rel: 'canonical',
                href: usePrismicCanonicalUrl(webResponse),
            },
        ],
        meta: [
            { name: 'version', content: runtimeConfig.public.version },
        ],
    })
}
