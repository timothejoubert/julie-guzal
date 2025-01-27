type Theme = 'light' | 'dark'
const DEFAULT_THEME = 'light'

export function useUiThemeState() {
    const theme = useCookie<Theme>('app_ui_theme', {
        watch: true,
        maxAge: 24 * 60 * 60,
        default: () => DEFAULT_THEME,
    })

    const userPrefersLight = () => window?.matchMedia?.('(prefers-color-scheme: light)').matches

    function getUsePreferredTheme() {
        // If cookie already set ignore use preference
        if (theme.value) return

        if (window.matchMedia?.('(prefers-color-scheme)').media !== 'not all') {
            return userPrefersLight() ? 'light' : 'dark'
        }

        return DEFAULT_THEME
    }

    onMounted(() => {
        const v = getUsePreferredTheme()
        if (v) theme.value = v
    })

    // Watch user change
    function onPrefersColorSchemeChange(event: Event & { matches: boolean }) {
        theme.value = event.matches ? 'dark' : 'light'
    }

    onMounted(() => {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', onPrefersColorSchemeChange)
    })

    onBeforeUnmount(() => {
        window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', onPrefersColorSchemeChange)
    })

    const appThemeClass = computed(() => `app--theme-${theme.value}`)

    useHead({
        htmlAttrs: {
            'class': appThemeClass,
            'data-theme': theme,
        },
    })

    return theme
}
