import { joinURL } from 'ufo'
import type { Link, Script } from '@unhead/schema'
import type { PrismicWebResponse } from '~/composables/use-prismic-fetch-page'
import { getFormattedLocale } from '~/composables/use-locale'
import { I18N_DEFAULT_LOCALE } from '~/i18n/i18n.config'

export function usePrismicHead(webResponse?: PrismicWebResponse) {
    const nuxtApp = useNuxtApp()
    const route = useRoute()
    const runtimeConfig = useRuntimeConfig()

    const { $i18n } = nuxtApp

    const script: (Script<['script']> | string)[] = []
    const link: Link[] = [
        {
            rel: 'canonical',
            href: joinURL(runtimeConfig.public.site.url, webResponse?.url || route.fullPath),
        },
    ]

    // ALTERNATE LINKS
    const currentAlternateLink = { id: 'default', type: webResponse?.type || '', lang: I18N_DEFAULT_LOCALE }
    const alternateLinks = [...webResponse?.alternate_languages || [], currentAlternateLink]

    const alternateLinksHead = alternateLinks.map((alternateLink) => {
        const formattedLocale = getFormattedLocale(alternateLink.lang)
        const locale = formattedLocale === I18N_DEFAULT_LOCALE ? '' : formattedLocale
        return {
            hid: `alternate-${alternateLink.lang}`,
            rel: 'alternate',
            hreflang: alternateLink.lang,
            href: joinURL(runtimeConfig.public.site.url, locale, route.fullPath),
        }
    })
    if (alternateLinksHead.length) link.push(...alternateLinksHead)

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
