<script  lang="ts" setup>
import type { SliceComponentProps } from '@prismicio/vue/src/SliceZone/types'
import type { GalleryGridSlice, GalleryPageDocument } from '~/prismicio-types'
import { components } from '~/slices'

const props = defineProps<{
    document: GalleryPageDocument
}>()

const slices = computed(() => props.document.data.slices)

const isGalleryGrid = (slice: SliceComponentProps) => (slice.slice_type === 'gallery_grid')
const galleryGridSlices = computed(() => slices.value.filter(isGalleryGrid) as GalleryGridSlice[])
const otherSlices = computed(() => slices.value.filter(s => !isGalleryGrid(s)))
</script>

<template>
    <div :class="$style.root">
        <VTopBar :class="$style['top-bar']" />
        <main>
            <LazyVMergedGallerySlice
                v-if="galleryGridSlices.length"
                :slices="galleryGridSlices"
            />
            <LazySliceZone
                v-if="otherSlices"
                :slices="otherSlices"
                :components="components"
            />
        </main>
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/mixins/theme' as *;

.root {
    @include theme('light');

    background-color: var(--theme-color-background);
    color: var(--theme-color-on-background);
}

.top-bar {
    & :global(.v-nav) {
        @include theme('dark')
    }

    @include media('>=md') {
        & :global(.v-nav) {
            @include theme('light')
        }
    }
}
</style>
