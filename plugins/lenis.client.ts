import Lenis from 'lenis'

// TODO: disable if prefersReduceMotion is enable
export default defineNuxtPlugin((_nuxtApp) => {
    const lenis = new Lenis({
        touchMultiplier: 0,
    })

    if (import.meta.client) {
        const reduceMotion = !!window?.matchMedia(`(prefers-reduced-motion: reduce)`).matches

        lenis.options.wheelMultiplier = reduceMotion ? 0 : 1
        lenis.options.lerp = reduceMotion ? 1 : 0.08

        function raf(time: DOMHighResTimeStamp) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)
    }

    return {
        provide: {
            lenis,
        },
    }
})
