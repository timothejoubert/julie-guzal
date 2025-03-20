import Lenis from 'lenis'

// TODO: disable if prefersReduceMotion is enable
export default defineNuxtPlugin((_nuxtApp) => {
    const lenis = new Lenis()

    if (import.meta.client) {
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
