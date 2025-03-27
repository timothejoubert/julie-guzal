import { joinURL } from 'ufo'
import type { Script, Link } from '@unhead/vue'
import type { PrismicWebResponse } from '~/composables/use-prismic-fetch-page'
import { getFormattedLocale } from '~/composables/use-locale'
import { I18N_DEFAULT_LOCALE } from '~/constants/i18n'

export function usePrismicHead(webResponse?: PrismicWebResponse) {
    const nuxtApp = useNuxtApp()
    const route = useRoute()
    const runtimeConfig = useRuntimeConfig()

    const { $i18n } = nuxtApp

    const script: (Script | string)[] = []
    const link: Link[] = [
        {
            rel: 'canonical',
            href: joinURL(runtimeConfig.public.site.url, webResponse?.url || route.fullPath),
        },
    ]

    // ALTERNATE LINKS
    const alternateLinks = webResponse?.alternate_languages || []
    if (alternateLinks.length) {
        alternateLinks.forEach((alternateLink) => {
            const formattedLocale = getFormattedLocale(alternateLink.lang)
            const locale = formattedLocale === I18N_DEFAULT_LOCALE ? '' : formattedLocale
            link.push({
                hid: `alternate-${alternateLink.lang}`,
                rel: 'alternate',
                hreflang: alternateLink.lang,
                href: joinURL(runtimeConfig.public.site.url, locale, route.fullPath),
            })
        })
    }

    //
    useHead({
        htmlAttrs: {
            lang: $i18n.locale.value,
        },
        script,
        link,
        meta: [
            { name: 'version', content: runtimeConfig.public.version },
        ],
    })

    return alternateLinks
}
