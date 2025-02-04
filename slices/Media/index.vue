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

function getSizes() {
    if (isDuoMedia.value) return 'xs:100vw sm:100vw md:100vw lg:50vw xl:50vw xxl:50vw hq:50vw qhd:50vw'
    return 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw hq:100vw qhd:100vw'
}

const isDuoMedia = computed(() => props.slice.variation === 'duoMedia')

function getFilledDocument(img: object, embed: object) {
    return embed?.embed_url ? embed : img
}

const mediaGroup = computed(() => {
    if (isDuoMedia.value) {
        return [
            {
                document: getFilledDocument(props.slice.primary.main_image, props.slice.primary.main_embed),
                image: {
                    document: props.slice.primary.main_image,
                    sizes: getSizes(),
                },
                video: {},
            },
            {
                document: getFilledDocument(props.slice.primary.secondary_image, props.slice.primary.secondary_embed),
                image: {
                    document: props.slice.primary.secondary_image,
                    sizes: getSizes(),
                },
                video: {},
            },
        ]
    }

    return [
        {
            document: getFilledDocument(props.slice.primary.image, props.slice.primary.embed),
            image: {
                document: props.slice.primary.image,
                sizes: getSizes(),
            },
            video: {},
        },
    ]
})
</script>

<template>
    <VSlice
        :slice="slice"
        :class="[$style.root, isDuoMedia && $style['root--duo-media']]"
        class="grid"
    >
        <VPrismicMedia
            v-for="(media, index) in mediaGroup"
            :key="index"
            :document="media.document"
            :image="media.image"
            :video="media.video"
            :class="$style.image"
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
    --v-player-video-height: 100%;

    width: 100%;
    grid-column: 1 / -1;

    @include media('>=md') {
        .root--duo-media & {
            grid-column:  span 6;
        }
    }
}
</style>
