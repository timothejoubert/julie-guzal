export function useBodyScrollLock() {
    const bodyRef = useBodyElement()
    const isLocked = useScrollLock(bodyRef)

    // SCROLL LOCK + BODY PADDING
    function disableScroll() {
        document.body.style.paddingRight = `var(--scroll-bar-width)`
        document.body.style.overflow = `hidden`
        // isLocked.value = true
    }

    function enabledScroll() {
        document.body.style.paddingRight = `initial`
        document.body.style.overflow = `initial`
        // isLocked.value = false
    }

    return { disableScroll, enabledScroll, isLocked }
}
