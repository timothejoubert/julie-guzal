import gsap from 'gsap'
import type { TransitionProps } from 'vue'
import { usePageTransitionState } from '~/composables/use-page-transition-state'
// import { useActiveProjectCardElement } from '~/composables/use-active-project-card-element'

export type PageTransitionEventData = {
    pageEl: HTMLElement
    linkClicked: HTMLElement | undefined
    done: () => void
}

export const defaultPageTransition: TransitionProps = {
    name: 'master-transition',
    // mode: 'default',
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
        const tl = gsap.timeline({ paused: true, onComplete: done })

        const isSlide = name.value === 'slide-left' || name.value === 'slide-right'
        if (isSlide) {
            tl.to(el, { xPercent: name.value === 'slide-right' ? 100 : -100, duration: 1, ease: 'power2.out' })
        }
        else {
            tl.to(el, { scale: 0.98, duration: 1, ease: 'power2.out' })
        }

        tl.play()
        // }
    },
    onEnter: (el, done) => {
        const { animationComplete, name } = usePageTransitionState()

        gsap.set(el, {
            position: 'absolute',
            top: 0,
            zIndex: 1000,
            autoAlpha: 0,
            scale: name.value === 'default' ? 0.98 : 1,
            xPercent: name.value === 'slide-left'
                ? 100
                : name.value === 'slide-right'
                    ? -100
                    : 0,
        })

        gsap
            .timeline({
                delay: name.value === 'default' ? 1 : 0,
                paused: true,
                onComplete() {
                    animationComplete.value = true
                    done()
                },
            })
            .to(el, { autoAlpha: 1, scale: 1, xPercent: 0, duration: 1, ease: 'power2.out' })
            .play()
    },
}
