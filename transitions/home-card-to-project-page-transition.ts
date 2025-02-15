import type { TransitionProps } from 'vue'
import EventType from '~/constants/event-type'

const HOME_CARD_TO_PROJECT_TRANSITION = 'home-card-to-project-page-transition'

export const homeToProjectTransition: TransitionProps = {
    name: HOME_CARD_TO_PROJECT_TRANSITION,
    css: false,
    mode: 'out-in',
    onLeave(el, done) {
        console.log('onLeave:', HOME_CARD_TO_PROJECT_TRANSITION)
        eventBus.emit(EventType.PAGE_TRANSITION_LEAVE)

        const isHomeToProjectTransition = el.classList.contains(HOME_CARD_TO_PROJECT_TRANSITION)
        const cardClicked = el.querySelector('a[aria-current="page"]')?.parentElement

        if (!isHomeToProjectTransition || !cardClicked) {
            done()
        }

        window.setTimeout(() => {
            console.log('onLeave call done')
            // done()
        }, 2000)

        done()
    },
    onAfterLeave() {
        eventBus.emit(EventType.PAGE_TRANSITION_AFTER_LEAVE)
    },
    onEnter(element, done) {
        eventBus.emit(EventType.PAGE_TRANSITION_ENTER)
        done()
    },
    onAfterEnter() {
        eventBus.emit(EventType.PAGE_TRANSITION_AFTER_ENTER)
    },
}
