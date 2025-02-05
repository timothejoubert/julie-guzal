<script setup lang="ts">
import type { MasonryMediasSlice } from '~/prismicio-types'

const props = defineProps(getSliceComponentProps<MasonryMediasSlice>())
const primary = computed(() => props.slice.primary)
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
                :class="$style.image"
                :document="field.image"
                :image="{ sizes: 'xs:100vw sm:100vw md:100vw lg:50vw xl:50vw xxl:50vw hq:50vw qhd:50vw' }"
            />
        </template>
    </VSlice>
</template>

<style lang="scss" module>
.root {
    margin-block: rem(242) rem(120);
    column-count: 1;
    padding-inline: var(--gutter);

    @include media('>=lg') {
        margin-block: rem(235) rem(180);
        column-count: 2;
        column-gap: rem(24);
    }
}

.image {
    grid: 1 / -1;
    margin-bottom: rem(10);

    @include media('>=lg') {
        margin-bottom: rem(24);
    }
}
</style>
