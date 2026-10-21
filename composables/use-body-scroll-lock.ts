export function useBodyScrollLock() {
    // SCROLL LOCK (no compensation needed: `scrollbar-gutter: stable` on <html> keeps the scrollbar space)
    function disableScroll() {
        document.body.style.overflow = `hidden`
    }

    // Remove the inline values instead of forcing `initial`, so stylesheet rules apply again
    function enabledScroll() {
        document.body.style.removeProperty('overflow')
    }

    return { disableScroll, enabledScroll }
}
