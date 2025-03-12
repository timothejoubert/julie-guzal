import gsap from 'gsap'
import type { TransitionProps } from 'vue'
import { usePageTransitionState } from '~/composables/use-page-transition-state'
import { getScrollBarWidth } from '~/utils/scroll-bar'

export type PageTransitionEventData = {
    pageEl: HTMLElement
    linkClicked: HTMLElement | undefined
    done: () => void
}

export const defaultPageTransition: TransitionProps = {
    name: 'master-transition',
    // mode: 'default',
    onBeforeLeave: () => {
        document.body.style.overflowX = 'hidden'
        // document.body.style.paddingRight = getScrollBarWidth()

        // useScrollLock create scroll bar shift when set overflow: hidden
        // const isLocked = useScrollLock(document.body)
        // isLocked.value = true

        const nuxtApp = useNuxtApp()
        nuxtApp.$lenis.stop()
    },
    onLeave: (el, done) => {
        const { animationComplete, name } = usePageTransitionState()
        animationComplete.value = false

        // const { cardElement, id } = useActiveProjectCardElement(el)
        // if (cardElement) {
        //     gsap
        //         .timeline({ paused: true, onComplete: done })
        //         .to(window, {
        //             duration: 0.6,
        //             scrollTo: {
        //                 y: '#' + id,
        //                 offsetY: window.innerHeight / 2 - cardElement.offsetHeight / 2,
        //             },
        //             ease: 'power2.out',
        //         })
        //         .to(cardElement, { scale: 1.2, duration: 1 })
        //         .play()
        // }
        // else {

        const tl = gsap.timeline({
            paused: true,
            onComplete() {
                gsap.set(el, { clearProps: true })
                done()
            },
        })

        const isSlide = name.value === 'slide-left' || name.value === 'slide-right'
        if (isSlide) {
            tl.to(el, {
                xPercent: name.value === 'slide-right' ? 100 : -100,
                duration: 1,
                ease: 'power2.out',
            })
        }
        else {
            tl.to(el, {
                y: 60,
                opacity: 0.3,
                scale: 0.9,
                transformOrigin: 'top center',
                duration: 1,
                ease: 'power1.out',
            })
        }

        tl.play()
        // }
    },
    onEnter: (el, done) => {
        const { animationComplete, name } = usePageTransitionState()

        const scrollWidth = getScrollBarWidth()
        console.log('enEnter', scrollWidth)

        const isSlide = name.value === 'slide-left' || name.value === 'slide-right'

        const tl = gsap.timeline({
            // delay: name.value === 'default' ? 1 : 0,
            paused: true,
            onComplete() {
                console.log('enter done')
                gsap.set(el, { clearProps: true })
                animationComplete.value = true
                done()
            },
        })

        if (isSlide) {
            gsap.set(el, {
                position: 'fixed',
                top: 0,
                maxWidth: `calc(100% - var(--scroll-bar-width)})`,
                zIndex: 1000,
                transformOrigin: 'top center',
                xPercent: name.value === 'slide-left'
                    ? 100
                    : name.value === 'slide-right'
                        ? -100
                        : 0,
            })
            tl.to(el, {
                xPercent: 0,
                duration: 1,
                ease: 'power2.out',
            })
        }
        else {
            gsap.set(el, {
                position: 'fixed',
                maxWidth: `calc(100% - var(--scroll-bar-width)})`,
                zIndex: 1000,
                top: '100vh',
                scale: 1.1,
                transformOrigin: 'top center',
            })

            tl.to(el, {
                scale: 1,
                top: 0,
                duration: 1,
                ease: 'power3.out',
            })
        }

        tl.play()
    },
    onAfterEnter: () => {
        console.log('onAfterLeave')
        // const isLocked = useScrollLock(document.body)
        // isLocked.value = false

        document.body.style.paddingRight = '0px'
        const nuxtApp = useNuxtApp()
        nuxtApp.$lenis.start()
    },
}
