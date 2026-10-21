export function useBodyScrollLock() {
    // SCROLL LOCK on <html>: it scrolls the viewport (`overflow-y: scroll`, assets/scss/_common.scss).
    // `scrollbar-gutter: stable` keeps the scrollbar space; `hidden` keeps the scroll position (unlike `clip`, see plugins/lenis.client.ts).
    function disableScroll() {
        document.documentElement.style.overflow = `hidden`
    }

    // Remove the inline values instead of forcing `initial`, so stylesheet rules apply again
    function enabledScroll() {
        document.documentElement.style.removeProperty('overflow')
    }

    return { disableScroll, enabledScroll }
}
