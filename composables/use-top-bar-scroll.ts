export function useTopBarScroll(hiddenThresholdDown = 130, hiddenThresholdUp = 30) {
    const { isHidden, isOnPageTop } = useTopBarState()

    let scrollY = 0
    let scrollDirection = 1
    let scrollOffset = 0
    let isMounted = false

    function update() {
        // A trailing throttled call can still fire after unmount: don't write the shared state then
        if (!isMounted) return

        const newScrollY = Math.abs(window.scrollY)
        isOnPageTop.value = newScrollY < hiddenThresholdDown

        const newScrollDirection = newScrollY === scrollY ? scrollDirection : newScrollY >= scrollY ? 1 : -1

        if (newScrollDirection !== scrollDirection) scrollOffset = 0

        // scroll dist from last reset
        scrollOffset += Math.abs(newScrollY - scrollY)
        scrollY = newScrollY
        scrollDirection = newScrollDirection

        const hidden
            = scrollDirection === 1
                ? scrollOffset > hiddenThresholdDown
                : newScrollY > hiddenThresholdDown && scrollOffset < hiddenThresholdUp

        if (hidden !== isHidden.value) isHidden.value = hidden
    }

    // Leading and trailing calls: the last scroll position is always processed
    const onScroll = useThrottleFn(update, 150, true, true)

    onMounted(() => {
        isMounted = true
        scrollY = window.scrollY

        update()
        window.addEventListener('scroll', onScroll, { passive: true })
    })

    onBeforeUnmount(() => {
        isMounted = false
        window.removeEventListener('scroll', onScroll)
    })

    return { isHidden, isOnPageTop }
}
