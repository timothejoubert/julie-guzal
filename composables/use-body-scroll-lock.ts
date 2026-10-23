export function useBodyScrollLock() {
    // SCROLL LOCK: `overflow` on body applies to the viewport, `scrollbar-gutter: stable` on html keeps the scrollbar space (no layout shift)
    function disableScroll() {
        document.body.style.overflow = `hidden`
    }

    // Remove the inline value instead of forcing `initial`, so stylesheet rules apply again
    function enabledScroll() {
        document.body.style.removeProperty('overflow')
    }

    return { disableScroll, enabledScroll }
}
