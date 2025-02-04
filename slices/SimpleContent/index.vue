<script setup lang="ts">
import type { Content } from '@prismicio/client'

const props = defineProps(
    getSliceComponentProps<Content.SimpleContent>([
        'slice',
        'index',
        'slices',
        'context',
    ]),
)
const primary = computed(() => props.slice.primary)
</script>

<template>
    <VSlice
        class="grid"
        :slice="slice"
        :class="$style.root"
    >
        <h1 :class="$style.title" v-if="primary.title">
            {{ primary.title }}
        </h1>
        <h2 :class="$style['secondary-title']" v-if="primary.secondary_title">
            {{ primary.secondary_title }}
        </h2>
        <VText :class="$style.content" v-if="primary.content" :content="primary.content" />
    </VSlice>
</template>

<style lang="scss" module>
@use 'assets/scss/variables/fonts' as *;

.root {
    padding-block: rem(40) rem(24);

    @include media('>=lg') {
        padding-block: rem(80) rem(24);
    }
}

.title {
    grid-column: 1 / -1;
    max-width: 28ch;
    font-family: $font-suisse-family;
    font-size: rem(20);
    line-height: 1.3;
    font-weight: 400;
    margin-block: 0;

    @include media('>=lg') {
        grid-column: 1 / span 5;
    }
}

@mixin font-body($weight: 300) {
    font-family: $font-suisse-family;
    font-size: rem(18);
    line-height: 1.3;
    font-weight: $weight;
}

.secondary-title {
    grid-column: 1 / -2;
    margin-block: rem(42) 0;
    @include font-body(500);

    @include media('>=lg') {
        margin-block: 0;
        margin-top: initial;
        grid-column: 8 / -1;
    }
}

.content {
    grid-column: 1 / -2;
    @include font-body;

    .secondary-title + & {
        margin-top: rem(16);
    }

    @include media('>=lg') {
        grid-column: 8 / -1;

        .secondary-title + & {
            margin-top: rem(24);
        }
    }
}
</style>
