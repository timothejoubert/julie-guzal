<script  lang="ts" setup>
import type { Slice } from '@prismicio/types'
import type { GalleryPageDocument } from '~/prismicio-types'
import { components } from '~/slices'
import PhotographySlice from '~/slices/Photography/index.vue'

const props = defineProps<{
    document: GalleryPageDocument
}>()

const data = computed(() => props.document.data)
const slices = computed(() => props.document.data.slices)

const isPhotographySlice = (sliceItem: Slice) => (sliceItem?.slice_type === 'photography')

const photoSliceList = computed(() => {
    const list = slices.value.filter(sliceItem => isPhotographySlice(sliceItem))
    return [...list, ...list, ...list, ...list, ...list, ...list, ...list, ...list]
})

const otherSliceList = computed(() => {
    return slices.value.filter(sliceItem => !isPhotographySlice(sliceItem))
})

function onImgClicked(index: number) {
    console.log('onImgClicked', index)
}
</script>

<template>
    <div :class="$style.root">
        <VTopBar :class="$style['top-bar']" />
        <main
            class="grid"
            :class="$style.list"
        >
            <template v-if="photoSliceList.length">
                <PhotographySlice
                    v-for="(photoSlice, i) in photoSliceList"
                    :key="i"
                    :index="i"
                    :slices="slices"
                    :context="{}"
                    :slice="photoSlice"
                    :class="$style.item"
                    @on-img-clicked="onImgClicked"
                />
            </template>
        </main>
        <LazySliceZone
            v-if="otherSliceList?.length"
            :slices="otherSliceList"
            :components="components"
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

.list {
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

    // & img {
    //    cursor: pointer;
    // }

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
</style>
