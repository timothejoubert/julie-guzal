import Lenis from 'lenis'
// Don't import 'lenis/dist/lenis.css': its `.lenis-stopped { overflow: clip }` turns <html> into a
// non-scroll container when the page transition calls `lenis.stop()`, which resets the scroll to 0
// and makes the leaving page jump to its top. Scroll locking is handled by useBodyScrollLock().
import { loadGsap } from '~/utils/animation/gsap'

// TODO: disable if prefersReduceMotion is enable
export default defineNuxtPlugin((_nuxtApp) => {
    const lenis = new Lenis({
        touchMultiplier: 0,
    })

    const reduceMotion = !!window?.matchMedia(`(prefers-reduced-motion: reduce)`).matches

    lenis.options.wheelMultiplier = reduceMotion ? 0 : 1
    lenis.options.lerp = reduceMotion ? 1 : 0.08

    // Own rAF loop until GSAP is loaded (it is not part of the entry chunk), so the page scrolls right away
    let rafId = requestAnimationFrame(function raf(time) {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
    })

    // Then drive Lenis from the GSAP ticker: one rAF loop for smooth scroll and animations (page transitions,
    // ScrollTrigger scrubs), so both read the same scroll position on the same frame.
    async function driveFromGsapTicker() {
        const { gsap, ScrollTrigger } = await loadGsap()

        cancelAnimationFrame(rafId)
        lenis.time = 0 // the GSAP ticker uses another clock: restart the delta from it
        lenis.on('scroll', ScrollTrigger.update)
        gsap.ticker.add(time => lenis.raf(time * 1000))
        gsap.ticker.lagSmoothing(0)
    }

    // GSAP is loaded once the page is loaded and the app idle, so it doesn't compete with the first paint and the
    // LCP image (a navigation or a parallax loads it earlier when needed)
    onNuxtReady(() => {
        if (document.readyState === 'complete') driveFromGsapTicker()
        else window.addEventListener('load', driveFromGsapTicker, { once: true })
    })

    return {
        provide: {
            lenis,
        },
    }
})
