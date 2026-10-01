<script setup lang="ts">
import type { MasonryMediasSlice } from '~/prismicio-types'
import type { MasonryItem } from '~/utils/masonry/get-masonry-split-index'
import type { ScrollParallaxLayer } from '~/composables/use-scroll-parallax'

const props = defineProps(getSliceComponentProps<MasonryMediasSlice>())
const primary = computed(() => props.slice.primary)

// Same value as `$breakpoints.lg`: two columns from there, stacked below
const TWO_COLUMNS_MEDIA = '(min-width: 1024px)'
// Embeds without dimensions are rendered 16/9 by VVideoPlayer
const DEFAULT_EMBED_DIMENSIONS = { width: 16, height: 9 }

// ITEMS
// Dimensions come from Prismic (image dimensions, oEmbed width/height): the box of each media is known
// before its component chunk or its file is loaded.
const items = computed(() => {
    return primary.value.list.map((field, index) => {
        const image = field.image?.url ? field.image : undefined
        const embedWidth = Number(field.embed?.width)
        const embedHeight = Number(field.embed?.height)
        const dimensions: MasonryItem = image?.dimensions
            ? { ...image.dimensions, maxWidth: image.dimensions.width }
            : embedWidth && embedHeight ? { width: embedWidth, height: embedHeight } : DEFAULT_EMBED_DIMENSIONS

        return {
            key: index,
            field,
            document: image || field.embed,
            dimensions,
            style: {
                aspectRatio: `${dimensions.width} / ${dimensions.height}`,
                maxWidth: dimensions.maxWidth ? `${dimensions.maxWidth}px` : undefined,
            },
        }
    })
})

// COLUMNS
// Two contiguous columns: the DOM (and reading) order is the Prismic list order, top to bottom of the first
// column then of the second one, as with the previous CSS columns. Below lg the columns are simply stacked.
const columnElements = useTemplateRefsList<HTMLElement>()
const { splitIndex } = useMasonryColumns(() => items.value.map(item => item.dimensions), {
    firstColumn: computed(() => columnElements.value[0]),
    secondColumn: computed(() => columnElements.value[1]),
    media: TWO_COLUMNS_MEDIA,
    // 1440px wide viewport: (1440 - 2 * 24 gutter - 24 column gap) / 2, rem(24) gap, rem(316) offset
    initialMetrics: { columnWidth: 684, gap: 24, offset: 316 },
})
const columns = computed(() => [items.value.slice(0, splitIndex.value), items.value.slice(splitIndex.value)])

// Columns changed of height: update the ScrollTrigger positions (this one and the ones below on the page)
const { $scrollTrigger } = useNuxtApp()
watch(splitIndex, () => nextTick(() => $scrollTrigger?.refresh()))

// PARALLAX
// One scrubbed tween per column (all the items of a column move together), driven by the slice position
const rootElement = useTemplateElement('rootElement')
const parallaxLayers = computed<ScrollParallaxLayer[]>(() => {
    const trigger = rootElement.value as HTMLElement | undefined
    if (!trigger) return []

    return columnElements.value.map((column, index) => ({
        target: column,
        trigger,
        // First column moves down (slower than the scroll), second one moves up (faster)
        vars: { y: () => column.offsetHeight * (index === 0 ? 0.01 : -0.02) },
    }))
})
useScrollParallax(parallaxLayers, { media: TWO_COLUMNS_MEDIA })

// Reveal
const rootElementIsVisible = useElementVisibility(rootElement)
const { firstReveal } = useWebsiteReveal()
const reveal = computed(() => {
    if (!firstReveal.value) return

    return rootElementIsVisible.value
})
</script>

<template>
    <VSlice
        ref="rootElement"
        :slice="slice"
        class="element-translate element-translate--05-delay"
        :class="[$style.root, reveal && 'element-translate--reveal']"
    >
        <template v-if="items.length">
            <div
                v-for="(column, columnIndex) in columns"
                :key="columnIndex"
                :ref="columnElements.set"
                :class="$style.column"
            >
                <div
                    v-for="item in column"
                    :key="item.key"
                    :class="$style.item"
                    :style="item.style"
                >
                    <VPrismicMedia
                        :document="item.document"
                        :image="{ sizes: 'xs:100vw md:100vw lg:50vw xl:50vw xxl:50vw hd:50vw qhd:50vw' }"
                        :video="{
                            autoplay: item.field.video_autoplay,
                            controls: !item.field.video_autoplay,
                        }"
                    />
                </div>
            </div>
        </template>
    </VSlice>
</template>

<style lang="scss" module>
.root {
    position: relative;
    z-index: 1;
    background-color: var(--theme-color-background);
    padding-block: #{rem(242 - 24 - 16)} rem(120);
    padding-inline: var(--gutter);

    @include media('>=lg') {
        display: flex;
        align-items: flex-start;
        padding-block: rem(235) rem(180);
        column-gap: rem(24);
    }
}

.column {
    @include media('>=lg') {
        min-width: 0;
        flex: 1 1 0;

        & + & {
            // Static offset of the second column (not animated: it's part of the layout)
            padding-top: rem(316);
        }
    }
}

.item {
    // The box keeps the media ratio before the media (and its async component) is loaded
    margin-bottom: var(--gutter);
}
</style>
