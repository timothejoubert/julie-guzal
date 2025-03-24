<script setup lang="ts">
defineProps({
    tag: { type: String, default: 'div' },
})

const index = defineModel<number>({ default: -1 })
const root = ref<HTMLElement | null>(null)

// disabled dragging for now
const { hasOverflow, isDragging } = useDraggableScroll({ element: ref(null) })
// const { hasOverflow, isDragging } = useDraggableScroll({ element: root) })

// INIT SCROLL LISTENERS
const isScrolling = ref(false)
let scrollTimeoutId: undefined | number = undefined

const onScrollEvent = (event: Event) => {
    isScrolling.value = event.type === 'scroll'

    if (event.type === 'scrollend') {
        onScrollEnd()
    }
    else {
        clearTimeout(scrollTimeoutId)
        scrollTimeoutId = window.setTimeout(onScrollEnd, 150)
    }
}

function initOnScrollStartEvent() {
    if (!root.value) return
    root.value.addEventListener('scroll', onScrollEvent)
    root.value.addEventListener('scrollend', onScrollEvent)
}

function disposeOnScrollStartEvent() {
    if (!root.value) return
    root.value.removeEventListener('scroll', onScrollEvent)
    root.value.removeEventListener('scrollend', onScrollEvent)
}

onMounted(initOnScrollStartEvent)
onBeforeUnmount(disposeOnScrollStartEvent)

// SCROLL_LEFT CAROUSEL VALUE
const rootScrollLeft = ref(0)
const updateRootScrollLeft = () => (rootScrollLeft.value = root.value?.scrollLeft || 0)
onMounted(updateRootScrollLeft)
watch(isDragging, updateRootScrollLeft)
watch(isScrolling, updateRootScrollLeft)

// COMPUTE SLIDE DATA
const { width } = useWindowSize()
const childrenData = ref(getChildrenData())
const updateChildrenData = () => (childrenData.value = getChildrenData())

function getChildrenData() {
    if (!root.value) {
        return []
    }

    const children = [...root.value.children] as HTMLElement[]

    return children.map((el, index) => {
        const start = el.offsetLeft
        const width = el.offsetWidth
        return {
            el,
            index,
            snapStart: start,
            snapCenter: el.offsetLeft + width / 2,
            snapEnd: el.offsetLeft + width,
        }
    })
}
watch(width, () => {
    updateChildrenData()
    onScrollEnd()
})

// ACTIVE SLIDE
const currentSlideIndex = computed(() => {
    return childrenData.value.findIndex((childData) => {
        return (childData?.snapCenter || 0) >= rootScrollLeft.value
    })
})

function onScrollEnd() {
    isScrolling.value = false

    const isInlineSnapped = childrenData.value.find((slide) => {
        const scrollLeft = Math.floor(rootScrollLeft.value)
        return Math.floor(slide.snapStart) === scrollLeft || Math.floor(slide.snapEnd) === scrollLeft
    })

    if (!isInlineSnapped) {
        scrollToIndex(currentSlideIndex.value)
    }
}

// Update slide Index
let resizeObserver: null | ResizeObserver = null
function onRootResize() {
    if (currentSlideIndex.value === -1) scrollToIndex(index.value, 'instant')
}
watch(root, () => {
    if (!root.value) return
    resizeObserver = new ResizeObserver(onRootResize)
    resizeObserver.observe(root.value)
})

onBeforeUnmount(() => {
    if (!root.value) return
    resizeObserver?.unobserve(root.value)
    resizeObserver = null
})

watch(index, () => {
    scrollToIndex(index.value)
})

function getOffsetLeft(newIndex: number) {
    if (!root.value) return

    const children = [...root.value.children] as HTMLElement[]
    return children[newIndex]?.offsetLeft - root.value.offsetLeft
}

function scrollToIndex(newIndex: number, scrollBehavior?: ScrollBehavior) {
    if (!root.value || newIndex < 0 || currentSlideIndex.value === newIndex) {
        return
    }

    // Sometimes childrenDate aren't set onMounted
    if (!childrenData.value.length) updateChildrenData()
    const offsetLeft = getOffsetLeft(newIndex)
    if (typeof offsetLeft === 'number') root.value.scrollTo({ behavior: scrollBehavior || 'smooth', left: offsetLeft })
}
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
