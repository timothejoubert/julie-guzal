import type { TransitionProps } from 'vue'
import EventType from '~/constants/event-type'

export const HOME_CARD_TO_PROJECT_TRANSITION = 'home-card-to-project-page-transition'
export const DEFAULT_TRANSITION = 'default-transition'

export type PageTransitionEventData = {
    pageEl: HTMLElement
    linkClicked: HTMLElement | undefined
    done: () => void
}

export const defaultPageTransition: TransitionProps = {
    name: DEFAULT_TRANSITION,
    type: 'transition',
    mode: 'default',
    onBeforeLeave(_el) {
        // console.log('onBeforeLeave', el)
    },
    onLeave(el, done) {
        console.log('emit', EventType.PAGE_TRANSITION_LEAVE)

        const linkClicked = getProjectHomeCardClicked(el)
        eventBus.emit(EventType.PAGE_TRANSITION_LEAVE, { pageEl: el, linkClicked, done })

        // if (!linkClicked) {
        done()
        // }
    },
    onAfterLeave() {
        eventBus.emit(EventType.PAGE_TRANSITION_AFTER_LEAVE)
    },
    onEnter(el, done) {
        console.log('emit onEnter', el)

        const linkClicked = getProjectHomeCardClicked(el)
        eventBus.emit(EventType.PAGE_TRANSITION_ENTER, { pageEl: el, linkClicked, done })

        // if (!linkClicked) {
        done()
        // }
    },
    onAfterEnter() {
        // console.log('onAfterEnter')
        eventBus.emit(EventType.PAGE_TRANSITION_AFTER_ENTER)
    },
}

function getProjectHomeCardClicked(el: Element) {
    const isHomeToProjectTransition = el.classList.contains(HOME_CARD_TO_PROJECT_TRANSITION + '-leave-active')
    if (!isHomeToProjectTransition) return undefined

    return el.querySelector('a[aria-current="page"]') || undefined
}
