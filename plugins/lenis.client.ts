import Lenis from 'lenis'

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
