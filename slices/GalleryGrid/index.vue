<script setup lang="ts">
import type { SliceComponentProps } from '@prismicio/vue'
import type { GalleryGridSlice } from '~/prismicio-types'

const props = defineProps<SliceComponentProps<GalleryGridSlice>>()
const primary = computed(() => props.slice.primary)

const imageList = computed(() => {
    return primary.value.item?.filter((groupField) => {
        return groupField.image?.url
    }).map((groupField, index) => {
        const isLandscape = index === 0 || index === 1
        return {
            document: {
                ...groupField.image,
                copyright: groupField.image?.alt || groupField.description,
            },
            fit: 'crop',
            ar: isLandscape ? '566:342' : '330:432',
            sizes: isLandscape ? 'xs:95vw sm:95vw md:40vw lg:40vw xl:40vw qhd:40vw' : 'xs:95vw sm:95vw md:25vw lg:25vw xl:25vw qhd:25vw',
            // crop: 'top,left',
        }
    })
})

const { documents, index: mediaViewerIndex } = useMediaViewer()

const mediaViewerDocument = computed(() => {
    return imageList.value.map(media => (media.document))
})

function onClick(index: number) {
    console.log('onClick', index)
    documents.value = mediaViewerDocument.value
    mediaViewerIndex.value = index
}
</script>

<template>
    <VSlice
        class="grid"
        :slice="slice"
        :class="$style.root"
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
    margin-block: rem(202) rem(120);
    row-gap: rem(10);

    @include media('>=md') {
        margin-block: rem(48) rem(80);
        row-gap: rem(24);
    }

    @include media('>=lg') {
        margin-block: rem(235) rem(180);
    }
}

.item {
    grid-column: 1 / -1;
    overflow: hidden;
    background: initial;
    border: initial;
    padding: initial;

    @include media('>=md') {
        &:nth-child(9n + 1) {
            grid-column: 8 / -1;
        }

        &:nth-child(9n + 2) {
            display: grid;
            grid-template-columns: subgrid;
            grid-column: 1 / -1;

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
            grid-template-columns: subgrid;
            grid-column: 1 / -1;

            & > * {
                grid-column: 10 / -1;
            }
        }

        &:nth-child(9n + 9) {
            display: grid;
            grid-template-columns: subgrid;
            grid-column: 1 / -1;

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
