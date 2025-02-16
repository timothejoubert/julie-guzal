<script setup lang="ts">
import type { SliceComponentProps } from '@prismicio/vue'
import type { CrossNavSlice } from '~/prismicio-types'

const props = defineProps<SliceComponentProps<CrossNavSlice>>()
const primary = computed(() => props.slice.primary)

const { t } = useI18n()
const title = computed(() => primary.value?.title || t('cross_nav.title'))

const $style = useCssModule()
const rootClasses = computed(() => {
    return [$style.root, $style[`root--theme-${primary.value.theme}`]]
})
</script>

<template>
    <VSlice
        class="grid"
        :slice="slice"
        :class="rootClasses"
    >
        <h1 :class="$style.title">
            {{ title }}
        </h1>
        <template v-if="primary.links">
            <VPrismicLinkIcon
                v-for="(linkGroup, index) in primary.links"
                :key="index"
                :to="linkGroup.internal_page"
                :class="$style.link"
                :label="linkGroup.label || linkGroup.internal_page.url"
                icon-size="52"
            />
        </template>
    </VSlice>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/fluid' as *;
@use 'assets/scss/variables/fonts' as *;
@use 'assets/scss/mixins/theme' as *;

@mixin font() {
    font-family: $font-lecturis-family;
    font-size: rem(100);
    font-weight: 300;
    line-height: 1;
    text-transform: uppercase;
}

.root {
    position: relative;
    color: var(--theme-color-on-background);
    isolation: isolate;
    padding-block: rem(12);

    @include theme-variants;

    &::before {
        position: absolute;
        z-index: -1;
        background-color: var(--theme-color-background);
        content: '';
        inset: 0 calc(var(--gutter) * -1);
    }

    @include media('>=lg') {
        padding-block: rem(24);
    }
}

.title {
    @include font;

    color: var(--theme-color-on-background);
    grid-column: 1 / -1;
    margin-block: 0 rem(104);

    @include media('>=lg') {
        margin-bottom: 0;
        grid-column: 1 / span 6;
    }
}

.link {
    @include font;

    display: flex;
    overflow: hidden;
    flex-direction: row-reverse;
    align-items: baseline;
    color: var(--theme-color-on-background);
    column-gap: rem(20);
    grid-column: 1 / -1;
    text-align: right;
    text-decoration: none;

    @include media('<md') {
        column-gap: rem(10);

        svg {
            width: rem(20);
            height: auto;
        }
    }

    @include media('>=lg') {
        grid-column: 6 / -1;
    }
}
</style>
