import type EventType from '~/constants/event-type'
import eventBus from '~/utils/event-bus'

export function usePageTransitionEvent(event: EventType, callback: () => void, options?: { keepListener: boolean }) {
    onBeforeMount(() => {
        eventBus[options?.keepListener ? 'on' : 'once'](event, callback)
    })

    onBeforeUnmount(() => {
        eventBus.off(event, callback)
    })
}
