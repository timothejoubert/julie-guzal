<script setup lang="ts">
import type { MasonryMediasSlice } from '~/prismicio-types'
import { getHtmlElement, type TemplateElement } from '~/utils/ref/get-html-element'

type StoredImage = { el: null | HTMLElement, top: null | number, index: number }

const props = defineProps(getSliceComponentProps<MasonryMediasSlice>())
const primary = computed(() => props.slice.primary)

const mediaInstances = ref<TemplateElement[]>([])
const imageElementList = computed(() => mediaInstances.value.map(instance => getHtmlElement(instance)))
const lastTopColumnedElement = computed(() => {
    return imageElementList.value.reduce((acc, el, index) => {
        const top = el?.getBoundingClientRect().top

        if (!acc.el || (top && acc?.top && top <= acc?.top)) acc = { el, top, index } as StoredImage
        return acc
    }, { el: null, top: null, index: -1 } as StoredImage)
})

const lastTopColumnedElementIndex = computed(() => lastTopColumnedElement.value.index)
</script>

<template>
    <VSlice
        :slice="slice"
        :class="$style.root"
    >
        <template v-if="primary.list.length">
            <VPrismicMedia
                v-for="(field, index) in primary.list"
                :key="index"
                ref="mediaInstances"
                :class="[$style.image, index === lastTopColumnedElementIndex && $style['image--offset-top']]"
                :document="field.image"
                :image="{ sizes: 'xs:100vw sm:100vw md:100vw lg:50vw xl:50vw xxl:50vw hq:50vw qhd:50vw' }"
            />
        </template>
    </VSlice>
</template>

<style lang="scss" module>
.root {
    column-count: 1;
    margin-block: rem(242) rem(120);
    padding-inline: var(--gutter);

    @include media('>=lg') {
        column-count: 2;
        column-gap: rem(24);
        margin-block: rem(235) rem(180);
    }
}

.image {
    margin-bottom: rem(10);
    grid: 1 / -1;

    @include media('>=lg') {
        margin-bottom: rem(24);
        transition: padding-top 0.4s ease(out-quad);

        &--offset-top {
            padding-top: rem(316);
        }
    }
}
</style>
