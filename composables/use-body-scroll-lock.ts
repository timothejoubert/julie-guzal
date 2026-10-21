// Scroll lock owners (page transition, media viewer): the page stays locked until all of them release it
const owners = new Set<string>()

export function useBodyScrollLock(owner: string) {
    // SCROLL LOCK on <html>: it scrolls the viewport (`overflow-y: scroll`, assets/scss/_common.scss).
    // `scrollbar-gutter: stable` keeps the scrollbar space; `hidden` keeps the scroll position (unlike `clip`, see plugins/lenis.client.ts).
    function disableScroll() {
        owners.add(owner)
        document.documentElement.style.overflow = `hidden`
    }

    // Remove the inline values instead of forcing `initial`, so stylesheet rules apply again
    function enabledScroll() {
        owners.delete(owner)
        if (!owners.size) document.documentElement.style.removeProperty('overflow')
    }

    return { disableScroll, enabledScroll }
}
