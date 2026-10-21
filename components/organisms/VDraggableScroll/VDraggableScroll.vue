<script setup lang="ts">
defineProps({
    tag: { type: String, default: 'div' },
})

const index = defineModel<number>({ default: -1 })
const root = ref<HTMLElement | null>(null)

// disabled dragging for now
const { hasOverflow } = useDraggableScroll({ element: ref(null) })
// const { hasOverflow, isDragging } = useDraggableScroll({ element: root) })

// SLIDE POSITIONS
// Always read from the DOM: cached positions/scrollLeft get stale while a smooth scroll is running,
// which used to leave the scroll position and the active index out of sync (active slide off-screen).
function getOffsetLeft(slideIndex: number) {
    if (!root.value) return

    const child = root.value.children[slideIndex] as HTMLElement | undefined
    if (!child) return

    return child.offsetLeft - root.value.offsetLeft
}

function getNearestIndex() {
    if (!root.value) return -1

    const scrollLeft = root.value.scrollLeft
    let nearestIndex = -1
    let nearestDistance = Infinity

    for (let i = 0; i < root.value.children.length; i++) {
        const distance = Math.abs((getOffsetLeft(i) ?? 0) - scrollLeft)
        if (distance < nearestDistance) {
            nearestDistance = distance
            nearestIndex = i
        }
    }

    return nearestIndex
}

// PROGRAMMATIC SCROLL
// Index targeted by the last scrollTo(), until it is reached or the user takes over (wheel, touch)
let targetIndex = -1

function isAtIndex(slideIndex: number) {
    const offsetLeft = getOffsetLeft(slideIndex)
    return !!root.value && typeof offsetLeft === 'number' && Math.abs(root.value.scrollLeft - offsetLeft) < 2
}

function scrollToIndex(newIndex: number, scrollBehavior: ScrollBehavior = 'smooth') {
    if (!root.value || newIndex < 0) return

    const offsetLeft = getOffsetLeft(newIndex)
    if (typeof offsetLeft !== 'number') return

    if (isAtIndex(newIndex)) {
        targetIndex = -1
        return
    }

    targetIndex = newIndex
    root.value.scrollTo({ behavior: scrollBehavior, left: offsetLeft })
}

watch(index, newIndex => scrollToIndex(newIndex))

// SCROLL END
let scrollTimeoutId: undefined | number = undefined

function onScroll() {
    // fallback for browsers without `scrollend`
    clearTimeout(scrollTimeoutId)
    scrollTimeoutId = window.setTimeout(onScrollEnd, 150)
}

function onScrollEnd() {
    clearTimeout(scrollTimeoutId)

    if (targetIndex !== -1) {
        // Programmatic scroll: make sure it lands on the targeted slide (it may have been interrupted)
        if (isAtIndex(targetIndex)) targetIndex = -1
        else scrollToIndex(targetIndex)
        return
    }

    // User scroll (trackpad, touch…): the slide shown becomes the active one, then snap on it
    const nearestIndex = getNearestIndex()
    if (nearestIndex === -1) return

    if (nearestIndex !== index.value) index.value = nearestIndex
    else scrollToIndex(nearestIndex)
}

function onUserScrollStart() {
    targetIndex = -1
}

const userScrollEvents = ['wheel', 'touchstart'] as const

onMounted(() => {
    if (!root.value) return

    root.value.addEventListener('scroll', onScroll, { passive: true })
    root.value.addEventListener('scrollend', onScrollEnd)
    userScrollEvents.forEach(event => root.value?.addEventListener(event, onUserScrollStart, { passive: true }))
})

onBeforeUnmount(() => {
    clearTimeout(scrollTimeoutId)
    if (!root.value) return

    root.value.removeEventListener('scroll', onScroll)
    root.value.removeEventListener('scrollend', onScrollEnd)
    userScrollEvents.forEach(event => root.value?.removeEventListener(event, onUserScrollStart))
})

// RESIZE (and first layout): keep the active slide in place without animation
useResizeObserver(root, () => {
    if (index.value >= 0) scrollToIndex(index.value, 'instant')
})
</script>

<template>
    <component
        :is="tag"
        ref="root"
        :class="$style.root"
        :data-has-overflow="hasOverflow"
    >
        <slot
            :active-slide="index"
        />
    </component>
</template>

<style lang="scss" module>
.root {
    display: flex;
    max-width: 100vw;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;
    overflow-x: scroll;
    scrollbar-width: none;
}
</style>
