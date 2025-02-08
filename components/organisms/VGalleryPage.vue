<script  lang="ts" setup>
import type { GalleryPageDocument } from '~/prismicio-types'
import { components } from '~/slices'

const props = defineProps<{
    document: GalleryPageDocument
}>()

const slices = computed(() => props.document.data.slices)
</script>

<template>
    <div :class="$style.root">
        <VTopBar :class="$style['top-bar']" />
        <LazySliceZone
            v-if="slices?.length"
            :slices="slices"
            :components="components"
            wrapper="main"
        />
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
