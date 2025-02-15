import type EventType from '~/constants/event-type'

export function usePageTransitionEvent(event: EventType, callback: (...args: never[]) => void, options?: { keepListener: boolean }) {
    onBeforeMount(() => {
        eventBus[options?.keepListener ? 'on' : 'once'](event, callback)
    })

    onUnmounted(() => {
        eventBus.off(event, callback)
    })
}
