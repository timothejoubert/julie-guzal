type BodyScrollLockTarget = HTMLElement | SVGElement | Document | null | undefined

export function useBodyScrollLock(el?: MaybeRefOrGetter<BodyScrollLockTarget>) {
    const target = ref<BodyScrollLockTarget>(toValue(el))

    function setFallbackTarget() {
        if (import.meta.client && !target.value) {
            target.value = document?.body
        }
    }
    setFallbackTarget()
    onMounted(setFallbackTarget)

    const isLocked = useScrollLock(target)

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
