// Page background color, exposed to the browser UI (theme-color) and to <html>:
// the scrollbar gutter (`scrollbar-gutter: stable`) and the page transition show the <html> background
function usePageBackgroundState() {
    // Color applied on <html> (see layouts/default.vue)
    const current = useState<string | null>('page-background', () => null)
    // Color of the entering page, applied once the page transition is over (no color jump mid-animation)
    const pending = useState<string | null>('page-background-pending', () => null)

    return { current, pending }
}

export function usePageBackground(color: string) {
    const { current, pending } = usePageBackgroundState()

    // First render: nothing is animating
    if (!current.value) current.value = color
    else pending.value = color

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
        htmlAttrs: { style: () => current.value ? `background-color: ${current.value}` : undefined },
    })
}
