export function useBodyScrollLock() {
    // SETUP TARGET
    const bodyRef = ref<HTMLElement>()
    tryOnMounted(() => {
        bodyRef.value = document.body
    })

    const isLocked = useScrollLock(bodyRef)

    // SCROLL LOCK + BODY PADDING
    function disableScroll() {
        document.body.style.paddingRight = `var(--scroll-bar-width)`
        isLocked.value = true
    }

    function enabledScroll() {
        document.body.style.paddingRight = `initial`
        isLocked.value = false
    }

    return { disableScroll, enabledScroll }
}
