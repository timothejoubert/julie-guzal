// Page background color, exposed to the browser UI (theme-color) and to the scrollbar track (assets/scss/_common.scss).
// The <html> background keeps the theme color: it's what the page transition reveals between the two pages.
function usePageBackgroundState() {
    // Color exposed on <html> as `--page-background` (see layouts/default.vue)
    const current = useState<string | null>('page-background', () => null)
    // Color of the entering page, applied once the page transition is over (no color jump mid-animation)
    const pending = useState<string | null>('page-background-pending', () => null)

    return { current, pending }
}

interface PageBackgroundOptions {
    // Apply the color right away instead of waiting for the end of the page transition (e.g. error page)
    immediate?: boolean
}

export function usePageBackground(color: string, options?: PageBackgroundOptions) {
    const { current, pending } = usePageBackgroundState()

    // Nothing is animating on the server, while hydrating (`current` comes from the payload) or on the first render
    if (options?.immediate || import.meta.server || useNuxtApp().isHydrating || !current.value) {
        current.value = color
        pending.value = null
    }
    else {
        pending.value = color
    }

    useHead({
        meta: [{ name: 'theme-color', content: color }],
    })
}

export function commitPageBackground() {
    const { current, pending } = usePageBackgroundState()

    if (pending.value) current.value = pending.value
    pending.value = null
}

export function usePageBackgroundHead() {
    const { current } = usePageBackgroundState()

    useHead({
        // Used by the scrollbar track (assets/scss/_common.scss)
        htmlAttrs: { style: () => current.value ? `--page-background: ${current.value}` : undefined },
    })
}
