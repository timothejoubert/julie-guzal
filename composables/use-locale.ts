import { joinURL } from 'ufo'

export function getFormattedLocale(localeCode: string) {
    if (localeCode.split('-').length) return localeCode.split('-')[0]
    else return localeCode
}

export function useLocale() {
    const route = useRoute()
    const { $i18n } = useNuxtApp()

    const hasMultipleLocale = computed(() => $i18n.locales.value.length > 1)

    const extractLocaleFromUrl = computed(() => {
        return $i18n.locales.value.find((locale) => {
            return route.fullPath.includes(locale.code) || route.fullPath.includes(getFormattedLocale(locale.code))
        })?.code
    })

    const fetchLocaleOption = computed(() => {
        if (!hasMultipleLocale.value || !extractLocaleFromUrl.value) {
            // dont't add locale to option
            // if Prismic has only one locale setup
            return undefined
        }

        return {
            lang: extractLocaleFromUrl.value,
        }
    })

    function getLocalizedUrl(url: string) {
        const currentLocale = $i18n.locale.value.toLowerCase()

        if (currentLocale === $i18n.defaultLocale.toLowerCase()) {
            return url
        }
        else {
            return joinURL(currentLocale, url)
        }
    }

    return { fetchLocaleOption, getLocalizedUrl }
}
