export function useBodyScrollLock() {
    // SCROLL LOCK + BODY PADDING (compensates the hidden scrollbar)
    function disableScroll() {
        document.body.style.paddingRight = `var(--scroll-bar-width, 0px)`
        document.body.style.overflow = `hidden`
    }

    // Remove the inline values instead of forcing `initial`, so stylesheet rules apply again
    function enabledScroll() {
        document.body.style.removeProperty('padding-right')
        document.body.style.removeProperty('overflow')
    }

    return { disableScroll, enabledScroll }
}
