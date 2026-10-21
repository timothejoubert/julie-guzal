<script lang="ts" setup>
import type { ImageField } from '@prismicio/client'

// Project page hero <picture>. Shared by VProjectPage and VProjectCard (hover preload): both must render the
// exact same sources so the browser picks the same candidate and the preloaded file is reused from the cache.
defineProps<{
    image: ImageField
    imgAttrs?: Record<string, unknown>
}>()
</script>

<template>
    <VPrismicImage
        :document="image"
        loading="eager"
        :img-attrs="imgAttrs"
    >
        <VPictureSource
            sizes="xs:100vw sm:100vw md:100vw"
            media="(max-width: 767px)"
            :modifiers="{
                fit: 'crop',
                ar: '375:448',
                width: '375',
                height: '448',
            }"
        />
        <VPictureSource
            sizes="lg:100vw xl:100vw xxl:100vw qhd:100vw"
            :modifiers="{
                fit: 'crop',
                ar: '1440:610',
                width: '1440',
                height: '610',
            }"
        />
    </VPrismicImage>
</template>
