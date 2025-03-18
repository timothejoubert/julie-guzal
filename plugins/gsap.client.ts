import { gsap } from 'gsap'
import Flip from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'
// import ScrollSmoother from 'gsap/ScrollSmoother'

export default defineNuxtPlugin((_nuxtApp) => {
    if (import.meta.client) {
        gsap.registerPlugin(Flip, ScrollTrigger, ScrollToPlugin)
    }

    return {
        provide: {
            gsap,
            scrollTrigger: ScrollTrigger,
            // flip: Flip,
            // scrollToPlugin: ScrollToPlugin,
        },
    }
})
