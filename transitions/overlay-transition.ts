import type { TransitionProps } from 'vue'
// import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import eventBus from '~/utils/event-bus'
import EventType from '~/constants/event-type'

function foregroundElement() {
    const foreground = document.createElement('div')
    foreground.style.position = 'fixed'
    foreground.style.inset = '0'
    foreground.style.zIndex = '5'
    foreground.style.background = '#151515'

    return foreground
}

export const overlayTransition: TransitionProps = {
    css: false,
    mode: 'out-in',
    onLeave(_element, done) {
        eventBus.emit(EventType.PAGE_TRANSITION_LEAVE)

        const foreground = foregroundElement()
        document.body.appendChild(foreground)

        // disableBodyScroll(document.body, { reserveScrollBarGap: true })

        const animation = foreground.animate([{ opacity: '0' }, { opacity: '1' }], {
            duration: 200,
        })

        animation.onfinish = () => {
            foreground.remove()
            done()
        }
    },
    onAfterLeave() {
        eventBus.emit(EventType.PAGE_TRANSITION_AFTER_LEAVE)
    },
    onEnter(element, done) {
        eventBus.emit(EventType.PAGE_TRANSITION_ENTER)

        const foreground = foregroundElement()
        element.appendChild(foreground)

        const animation = foreground.animate([{ opacity: '1' }, { opacity: '0' }], {
            duration: 400,
        })

        animation.onfinish = () => {
            // enableBodyScroll(document.body)
            foreground.remove()
            done()
        }
    },
    onAfterEnter() {
        eventBus.emit(EventType.PAGE_TRANSITION_AFTER_ENTER)
    },
}
