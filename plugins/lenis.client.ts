import Lenis from 'lenis'
// Don't import 'lenis/dist/lenis.css': its `.lenis-stopped { overflow: clip }` turns <html> into a
// non-scroll container when the page transition calls `lenis.stop()`, which resets the scroll to 0
// and makes the leaving page jump to its top. Scroll locking is handled by useBodyScrollLock().
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin((_nuxtApp) => {
    const lenis = new Lenis({
        touchMultiplier: 0,
    })

    // Reduced motion: no smoothing, the wheel scrolls natively (never block it: wheelMultiplier 0 froze the page).
    // Kept in sync when the preference changes at runtime.
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    function applyMotionPreference() {
        const reduceMotion = reduceMotionQuery.matches
        lenis.options.smoothWheel = !reduceMotion
        lenis.options.lerp = reduceMotion ? 1 : 0.08
    }
    applyMotionPreference()
    reduceMotionQuery.addEventListener('change', applyMotionPreference)

    // Drive Lenis from the GSAP ticker: one rAF loop for smooth scroll and animations (page transitions,
    // ScrollTrigger scrubs), so both read the same scroll position on the same frame.
    gsap.registerPlugin(ScrollTrigger)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(time => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    return {
        provide: {
            lenis,
        },
    }
})
