<script setup lang="ts">
import { useDraggableScroll } from '~/composables/use-draggable-scroll'

defineProps({
    tag: { type: String, default: 'div' },
})

const index = defineModel<number>({ default: 0 })

const root = ref<HTMLElement | null>(null)

const rootPos = ref({ x: 0, y: 0 })
function onMouseMove(point: Point) {
    rootPos.value = point
}

const { hasOverflow } = useDraggableScroll({ element: root, onMouseMove })

const childrenData = computed(() => {
    if (!root.value) return []
    const children = [...root.value.children] as HTMLElement[]

    return children.map((el, index) => {
        return {
            el,
            index,
            offsetLeft: el.offsetLeft,
        }
    })
})

const activeSlide = computed(() => {
    return childrenData.value.findIndex((childData) => {
        return (childData?.offsetLeft || 0) >= rootPos.value.x
    })
})

watch(activeSlide, (v) => {
    console.log('activeSlide', v)
    if (activeSlide.value !== -1) index.value = v
})

const getActiveSlide = () => activeSlide.value

function updateScrollPosition(newIndex: number | undefined) {
    const activeIndex = getActiveSlide()
    console.log('updateScrollPosition')
    console.log('activeIndex', activeIndex)

    if (!root.value || !newIndex || newIndex === -1 || activeIndex === newIndex || !hasOverflow.value) {
        console.log('prevent updateScrollPosition')
        return
    }

    const children = [...root.value.children] as HTMLElement[]
    const offsetLeft = children[newIndex]?.offsetLeft - root.value.offsetLeft

    if (offsetLeft) {
        root.value.addEventListener('scrollend', () => {
            const newIndex = getActiveSlide()
            console.log('onScrollEnd', newIndex)
            index.value = newIndex
        }, { once: true })

        root.value.scrollTo({ behavior: 'smooth', left: offsetLeft })
        index.value = newIndex
    }
}

// watch(index, (value) => {
//     console.log('watch index', value)
//     if (value) updateScrollPosition(index.value)
// })
//
// watch(hasOverflow, (value) => {
//     if (value) updateScrollPosition(index.value)
// })

onMounted(() => {
    updateScrollPosition(index.value)
})
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
    overflow-x: auto;
    scrollbar-width: none;
    max-width: 100vw;
    //scroll-snap-type: x mandatory;
}
</style>
