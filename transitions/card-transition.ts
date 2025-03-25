import gsap from 'gsap'
import type { TransitionProps } from 'vue'
import { useBodyScrollLock } from '~/composables/use-body-scroll-lock'

export const cardPageTransition: TransitionProps = {
    name: 'card-transition',
    onBeforeLeave: () => {
        // If leave page animation ended before after page
        // scrollBar need to be fixed to avoid shift when enter page fixed is the only page in DOM
        const { disableScroll } = useBodyScrollLock()
        disableScroll()
        const nuxtApp = useNuxtApp()
        nuxtApp.$lenis.stop()
    },
    onLeave: (el, done) => {
        const { animationComplete, pageDirection } = usePageTransitionState()
        animationComplete.value = false

        const tl = gsap.timeline({
            paused: true,
            onComplete() {
                gsap.set(el, { clearProps: true })
                done()
            },
        })

        if (pageDirection.value === 'forwards') {
            gsap.set(el, {
                transformOrigin: 'top',
            })

            // Need to finish before enter page to place
            tl.to(el, {
                y: -60,
                opacity: 0.3,
                scale: 0.9,
                duration: 0.8,
                ease: 'power1.in',
            })
        }
        else {
            gsap.set(el, {
                position: 'fixed',
                width: '100%',
                zIndex: '1100',
                transformOrigin: 'top',
            })

            tl.to(el, {
                top: '100vh',
                duration: 1,
                ease: 'power3.out',
            })
        }

        tl.play()
    },
    onEnter: (el, done) => {
        const { animationComplete, pageDirection } = usePageTransitionState()

        const tl = gsap.timeline({
            paused: true,
            onComplete() {
                gsap.set(el, { clearProps: true })
                animationComplete.value = true
                done()
            },
        })

        if (pageDirection.value === 'forwards') {
            gsap.set(el, {
                position: 'fixed',
                maxWidth: `calc(100% - var(--scroll-bar-width)`,
                top: '130vh',
                scale: 1.1,
                transformOrigin: 'top',
            })

            tl.to(el, {
                scale: 1,
                top: 0,
                duration: 1,
                ease: 'power2.out',
            })
        }
        else {
            tl.set(el, {
                position: 'fixed',
                width: '100%',
                y: -60,
                maxWidth: `calc(100% - var(--scroll-bar-width)`,
                opacity: 0.3,
                scale: 0.9,
                transformOrigin: 'top',
            })

            tl.to(el, {
                y: 0,
                scale: 1,
                opacity: 1,
                duration: 0.8,
                ease: 'power1.out',
            })
        }

        tl.play()
    },
    onAfterEnter: () => {
        const nuxtApp = useNuxtApp()
        nuxtApp.$lenis.start()
        const { enabledScroll } = useBodyScrollLock()
        enabledScroll()
    },
}
