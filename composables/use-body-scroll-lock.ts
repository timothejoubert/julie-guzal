type BodyScrollLockElement = Parameters<typeof useScrollLock>[0]

export function useBodyScrollLock(el?: BodyScrollLockElement, initialState?: boolean) {
    const target = ref<BodyScrollLockElement>(toValue(el))

    tryOnMounted(() => {
        if (import.meta.client && !target.value) {
            target.value = document?.body
        }
    })

    const isLocked = useScrollLock(target, initialState)

    function disableScroll() {
        if (target.value && 'style' in target.value) target.value.style.paddingRight = getScrollBarWidth()
        isLocked.value = true
    }
    function enabledScroll() {
        if (target.value && 'style' in target.value) target.value.style.paddingRight = '0px'
        isLocked.value = false
    }

    return { disableScroll, enabledScroll }
}
