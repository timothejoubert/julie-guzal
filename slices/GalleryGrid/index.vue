<script setup lang="ts">
import type { SliceComponentProps } from '@prismicio/vue'
import type { GalleryGridSlice } from '~/prismicio-types'

const props = defineProps<SliceComponentProps<GalleryGridSlice>>()
const primary = computed(() => props.slice.primary)

const isLastSliceType = computed(() => {
    const lastGallerySlice = props.slices.findLast((slice) => {
        return slice.slice_type === 'gallery_grid'
    })

    return lastGallerySlice?.id === props.slice.id
})

const imageList = computed(() => {
    return primary.value.item?.filter((groupField) => {
        return groupField.image?.url
    }).map((groupField, index) => {
        const forceLandscapeRatio = index % 9 === 0 || index % 9 === 1
        return {
            document: {
                ...groupField.image,
                copyright: groupField.image?.alt || groupField.description,
            },
            fit: 'crop',
            ar: forceLandscapeRatio ? '566:342' : '330:432',
            sizes: forceLandscapeRatio ? 'xs:95vw sm:95vw md:40vw lg:40vw xl:40vw qhd:40vw' : 'xs:95vw sm:95vw md:25vw lg:25vw xl:25vw qhd:25vw',
            // crop: 'top,left',
        }
    })
})

const { documents, index: mediaViewerIndex } = useMediaViewer()

const mediaViewerDocument = computed(() => {
    return imageList.value.map(media => (media.document))
})

function onClick(index: number) {
    documents.value = mediaViewerDocument.value
    mediaViewerIndex.value = index
}
</script>

<template>
    <VSlice
        class="grid"
        :slice="slice"
        :class="[$style.root, isLastSliceType && $style['root--last-slice-type']]"
    >
        <template v-if="imageList.length">
            <button
                v-for="(media, index) in imageList"
                :key="index"
                :class="$style.item"
                :aria-label="$t('media_viewer.open')"
                @click="onClick(index)"
            >
                <VPrismicImage
                    v-bind="media"
                    :class="$style.img"
                />
            </button>
        </template>
    </VSlice>
</template>

<style lang="scss" module>
.root {
    --gallery-grid-slice-row-gap: #{rem(10)};
    --gallery-grid-slice-margin-top: #{rem(202 - 24 - 16)};
    --gallery-grid-slice-margin-bottom: var(--gallery-grid-slice-row-gap);

    padding-block: var(--gallery-grid-slice-margin-top) var(--gallery-grid-slice-margin-bottom);
    row-gap: var(--gallery-grid-slice-row-gap);

    & + & {
        margin-top: 0 !important;
    }

    &--last-slice-type {
        --gallery-grid-slice-margin-bottom: #{rem(120)};
    }

    @include media('>=md') {
        --gallery-grid-slice-row-gap: #{rem(24)};
        --gallery-grid-slice-margin-top: #{rem(48)};

        &--last-slice-type {
            --gallery-grid-slice-margin-bottom: #{rem(80)};
        }
    }

    @include media('>=lg') {
        --gallery-grid-slice-margin-top: #{rem(235)};

        &--last-slice-type {
            --gallery-grid-slice-margin-bottom: #{rem(180)};
        }
    }
}

.item {
    overflow: hidden;
    padding: initial;
    border: initial;
    background: initial;
    grid-column: 1 / -1;

    @include media('>=md') {
        &:nth-child(9n + 1) {
            grid-column: 8 / -1;
        }

        &:nth-child(9n + 2) {
            display: grid;
            grid-column: 1 / -1;
            grid-template-columns: subgrid;

            & > * {
                grid-column: 1 / span 5;
            }
        }

        &:nth-child(9n + 3) {
            grid-column: 7 / span 3;
        }

        &:nth-child(9n + 4) {
            grid-column: 1 / span 3;
        }

        &:nth-child(9n + 5) {
            grid-column: 10 / -1;
        }

        &:nth-child(9n + 6) {
            grid-column: 4 / span 3;
        }

        &:nth-child(9n + 7) {
            grid-column: 7 / span 3;
        }

        &:nth-child(9n + 8) {
            display: grid;
            grid-column: 1 / -1;
            grid-template-columns: subgrid;

            & > * {
                grid-column: 10 / -1;
            }
        }

        &:nth-child(9n + 9) {
            display: grid;
            grid-column: 1 / -1;
            grid-template-columns: subgrid;

            & > * {
                grid-column: 1 / span 3;
            }
        }
    }
}

.img {
    cursor: pointer;
}
</style>
