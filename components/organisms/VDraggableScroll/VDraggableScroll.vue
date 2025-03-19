<script setup lang="ts">
defineProps({
    tag: { type: String, default: 'div' },
})

const index = defineModel<number>({ default: -1 })
const root = ref<HTMLElement | null>(null)

const { hasOverflow, isDragging } = useDraggableScroll({ element: root })

// Update scrollSnapType property
const isScrolling = ref(false)

const onScrollEvent = (event: Event) => {
    const isScrollEnd = event.type === 'scrollend'
    isScrolling.value = event.type === 'scroll' && !isScrollEnd

    if (isScrollEnd) onScrollEnd()
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

// Slides and root data
const rootScrollLeft = ref(0)
const updateRootScrollLeft = () => (rootScrollLeft.value = root.value?.scrollLeft || 0)
watch(isDragging, updateRootScrollLeft)
watch(isScrolling, updateRootScrollLeft)

// COMPUTE SLIDE DATA
const childrenData = ref(getChildrenData())

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
const { width } = useWindowSize()
watch(width, () => {
    console.log('window width change')
    childrenData.value = getChildrenData()
})

// ACTIVE SLIDE
const activeSlide = computed(() => {
    return childrenData.value.findIndex((childData) => {
        return (childData?.snapCenter || 0) >= rootScrollLeft.value
    })
})

function onScrollEnd() {
    const onSnapInline = !!childrenData.value.find((slide) => {
        const scrollLeft = Math.floor(rootScrollLeft.value)
        return Math.floor(slide.snapStart) === scrollLeft || Math.floor(slide.snapEnd) === scrollLeft
    })

    if (activeSlide.value === index.value && !onSnapInline) {
        updateScrollPosition(activeSlide.value)
    }
}

watch(activeSlide, (value) => {
    if (value !== index.value) updateScrollPosition(value)
})

watchEffect(() => {
    if (!hasOverflow.value) return
    if (activeSlide.value !== index.value) updateScrollPosition(index.value)
}, { flush: 'post' })

// Update slide Index
function updateScrollPosition(newIndex: number) {
    if (!root.value || newIndex < 0 || !hasOverflow.value) {
        return
    }

    const isFirstReveal = index.value >= 0 && activeSlide.value === -1
    const children = [...root.value.children] as HTMLElement[]
    const offsetLeft = children[newIndex]?.offsetLeft - root.value.offsetLeft

    if (typeof offsetLeft !== 'number') return

    root.value.scrollTo({ behavior: isFirstReveal ? 'instant' : 'smooth', left: offsetLeft })
    // On first reveal, childrenData haven't correct data
    if (isFirstReveal) {
        if (!childrenData.value.length) childrenData.value = getChildrenData()
        updateRootScrollLeft()
    }

    index.value = newIndex
}
</script>

<template>
    <component
        :is="tag"
        ref="root"
        :class="$style.root"
        :data-has-overflow="hasOverflow"
    >
        <slot />
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
