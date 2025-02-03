<script setup lang="ts">
import type { Content } from '@prismicio/client'

const props = defineProps(
    getSliceComponentProps<Content.MediaSlice>([
        'slice',
        'index',
        'slices',
        'context',
    ]),
)

const isDuoMedia = computed(() => props.slice.variation === 'duoMedia')
const images = computed(() => {
    if (isDuoMedia.value) {
        return []
    }
    return [props.slice.primary.image]
})
</script>

<template>
    <VSlice
        :slice="slice"
        :class="[$style.root, isDuoMedia && $style['root--duo-media']]"
        class="grid"
    >
        <VPrismicImage
            v-for="(image, index) in images"
            :key="index"
            :document="image"
            :class="$style.image"
            sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw hq:100vw qhd:100vw"
        />
    </VSlice>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;

.root {
    &--duo-media {
        margin-block: rem(24);
    }
}

.image {
    width: 100%;
    grid-column: 1 / -1;
}
</style>
