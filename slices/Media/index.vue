<script setup lang="ts">
import type { EmbedField, ImageField, LinkToMediaField } from '@prismicio/types'
import type { SliceComponentProps } from '@prismicio/vue'
import type { MediaSlice } from '~/prismicio-types'

const props = defineProps<SliceComponentProps<MediaSlice>>()

const primary = computed(() => props.slice.primary)
const isDuoMedia = computed(() => props.slice.variation === 'duoMedia')

function getFilledDocument({ image, embed, linkToMedia }: { image?: ImageField, embed?: EmbedField, linkToMedia?: LinkToMediaField }) {
    if (embed?.embed_url) return embed
    else if (image?.url) return image
    else if ((linkToMedia as { url?: string })?.url) return linkToMedia

    return undefined
}

const mediaGroup = computed(() => {
    if (isDuoMedia.value) {
        return [
            {
                document: getFilledDocument({
                    image: props.slice.primary.main_image,
                    embed: props.slice.primary.main_embed,
                    linkToMedia: props.slice.primary.main_video,
                }),
                image: {
                    sizes: 'xs:100vw sm:100vw md:100vw lg:50vw xl:50vw xxl:50vw hq:50vw qhd:50vw',
                },
                video: {
                    thumbnail: getFilledDocument({ image: props.slice.primary.main_image }),
                    autoplay: props.slice.primary.main_video_autoplay,
                    controls: !props.slice.primary.main_video_autoplay,
                },
            },
            {
                document: getFilledDocument({
                    image: props.slice.primary.secondary_image,
                    embed: props.slice.primary.secondary_embed,
                    linkToMedia: props.slice.primary.secondary_video,
                }),
                image: {
                    sizes: 'xs:100vw md:100vw lg:50vw xxl:50vw hq:50vw qhd:50vw',
                },
                video: {
                    thumbnail: getFilledDocument({ image: props.slice.primary.secondary_image }),
                    autoplay: props.slice.primary.secondary_video_autoplay,
                    controls: !props.slice.primary.secondary_video_autoplay,
                },
            },
        ]
    }

    return [
        {
            document: getFilledDocument({
                image: props.slice.primary.image,
                embed: props.slice.primary.embed,
                linkToMedia: props.slice.primary.video,
            }),
            image: {
                sizes: 'xs:100vw md:100vw lg:100vw xxl:100vw hq:100vw qhd:100vw',
            },
            video: {
                thumbnail: getFilledDocument({ image: props.slice.primary.image }),
                autoplay: props.slice.primary.video_autoplay,
                controls: !props.slice.primary.video_autoplay,
            },
        },
    ]
})

const spacing = computed(() => {
    const value = primary.value.spacing
    if (!value || value === 'none') return undefined

    return value
})

const $style = useCssModule()
const rootClasses = computed(() => {
    return [
        $style.root,
        spacing.value && $style[`root--margin-block-${spacing.value}`],
        isDuoMedia.value && $style['root--duo-media'],

    ]
})
</script>

<template>
    <VSlice
        :slice="slice"
        :class="rootClasses"
        class="grid"
    >
        <template
            v-for="(media, index) in mediaGroup"
            :key="index"
        >
            <VPrismicMedia
                v-if="media.document"
                :document="media.document"
                :image="media.image"
                :video="media.video"
                :class="[$style.image, index === 1 && $style['image--second']]"
            />
        </template>
    </VSlice>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;

.root {
    &--margin-block-xs {
        margin-block: rem(10);
    }

    &--margin-block-sm {
        margin-block: rem(24);
    }

    &--margin-block-md {
        margin-block: rem(48);
    }

    &--margin-block-lg {
        margin-block: rem(96);
    }

    @include media('>=lg') {
        &--margin-block-xs {
            margin-block: rem(24);
        }

        &--margin-block-sm {
            margin-block: rem(48);
        }

        &--margin-block-md {
            margin-block: rem(96);
        }

        &--margin-block-lg {
            margin-block: rem(144);
        }
    }

}

.image {
    width: 100%;
    grid-column: 1 / -1;

    @include media('>=md') {
        .root--duo-media & {
            grid-column: span 6;
        }

        .root--duo-media &--second {
            grid-column: 7 / -1;
        }
    }
}
</style>
