<script setup lang="ts">
import type { Content } from '@prismicio/client'
import type { EmbedField, ImageField, LinkToMediaField } from '@prismicio/types'

const props = defineProps(getSliceComponentProps<Content.MediaSlice>())

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
                },
            },
            {
                document: getFilledDocument({
                    image: props.slice.primary.secondary_image,
                    embed: props.slice.primary.secondary_embed,
                    linkToMedia: props.slice.primary.secondary_video,
                }),
                image: {
                    sizes: 'xs:100vw sm:100vw md:100vw lg:50vw xl:50vw xxl:50vw hq:50vw qhd:50vw',
                },
                video: {
                    thumbnail: getFilledDocument({ image: props.slice.primary.secondary_image }),
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
                sizes: 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw hq:100vw qhd:100vw',
            },
            video: {
                thumbnail: getFilledDocument({ image: props.slice.primary.image }) },
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
        <template
            v-for="(media, index) in mediaGroup"
            :key="index"
        >
            <VPrismicMedia
                v-if="media.document"
                :document="media.document"
                :image="media.image"
                :video="media.video"
                :class="$style.image"
            />
        </template>
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

    @include media('>=md') {
        .root--duo-media & {
            grid-column:  span 6;
        }
    }
}
</style>
