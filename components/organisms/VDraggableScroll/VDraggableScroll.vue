<script setup lang="ts">
defineProps({
    tag: { type: String, default: 'div' },
})

const index = defineModel<number>({ default: 0 })

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

const childrenData = computed(() => {
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
})

const activeSlide = computed(() => {
    return childrenData.value.findIndex((childData) => {
        return (childData?.snapCenter || 0) >= rootScrollLeft.value
    })
})

function onScrollEnd() {
    const onSnapInline = !!childrenData.value.find(slide => slide.snapStart === rootScrollLeft.value || slide.snapEnd === rootScrollLeft.value)
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

    const children = [...root.value.children] as HTMLElement[]
    const offsetLeft = children[newIndex]?.offsetLeft - root.value.offsetLeft

    if (typeof offsetLeft === 'number') {
        root.value.scrollTo({ behavior: 'smooth', left: offsetLeft })
        index.value = newIndex
    }
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
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;
    scrollbar-width: none;
    overflow-x: scroll;
    max-width: 100vw;
}
</style>
