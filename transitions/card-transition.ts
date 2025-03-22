import gsap from 'gsap'
import type { TransitionProps } from 'vue'
import { getScrollBarWidth } from '~/utils/scroll-bar'

export const cardPageTransition: TransitionProps = {
    name: 'card-transition',
    onBeforeLeave: () => {
        // document.body.style.overflowX = 'hidden'
        document.body.style.paddingRight = `${getScrollBarWidth()}px`
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

            tl.to(el, {
                y: -60,
                opacity: 0.3,
                scale: 0.9,
                duration: 1,
                ease: 'power2.out',
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
                ease: 'power2.out',
            })
        }

        tl.play()
    },
    onEnter: (el, done) => {
        const { animationComplete, pageDirection } = usePageTransitionState()

        const tl = gsap.timeline({
            paused: true,
            onComplete() {
                console.log('enter done')
                gsap.set(el, { clearProps: true })
                animationComplete.value = true
                done()
            },
        })

        if (pageDirection.value === 'forwards') {
            gsap.set(el, {
                position: 'fixed',
                width: '100%',
                top: '100vh',
                scale: 1.1,
                transformOrigin: 'top',
            })

            tl.to(el, {
                scale: 1,
                top: 0,
                duration: 1,
                ease: 'power3.out',
            })
        }
        else {
            tl.set(el, {
                position: 'fixed',
                y: -60,
                width: `calc(100% - var(--scroll-bar-width)`,
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
    },
}
