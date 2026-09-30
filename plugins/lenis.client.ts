import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// TODO: disable if prefersReduceMotion is enable
export default defineNuxtPlugin((_nuxtApp) => {
    const lenis = new Lenis({
        touchMultiplier: 0,
    })

    const reduceMotion = !!window?.matchMedia(`(prefers-reduced-motion: reduce)`).matches

    lenis.options.wheelMultiplier = reduceMotion ? 0 : 1
    lenis.options.lerp = reduceMotion ? 1 : 0.08

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
