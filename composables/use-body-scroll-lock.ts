export function useBodyScrollLock() {
    const documentElement = ref<HTMLElement | null>(null)
    onMounted(() => documentElement.value = document.body)

    const isLocked = useScrollLock(documentElement)

    function disableScroll() {
        isLocked.value = true
    }

    function enabledScroll() {
        isLocked.value = false
    }

    return { disableScroll, enabledScroll }
}
