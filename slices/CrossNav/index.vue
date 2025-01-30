<script setup lang="ts">
import type { Content } from '@prismicio/client'

const props = defineProps(
    getSliceComponentProps<Content.CrossNavSlice>([
        'slice',
        'index',
        'slices',
        'context',
    ]),
)
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
            <VPrismicLink
                v-for="(linkGroup, index) in primary.links"
                :key="index"
                :to="linkGroup.internal_page"
                :label="linkGroup.label || linkGroup.internal_page.url"
                :class="$style.link"
            />
        </template>
    </VSlice>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;
@use 'assets/scss/functions/fluid' as *;
@use 'assets/scss/variables/fonts' as *;
@use 'assets/scss/mixins/include-media' as *;
@use 'assets/scss/mixins/theme' as *;

@mixin font() {
    font-family: $font-lecturis-family;
    font-weight: 300;
    line-height: 1;
    font-size: rem(100);
    text-transform: uppercase;
}

.root {
    @include theme-variants;

    position: relative;
    padding-block: rem(12);

    &::before {
        position: absolute;
        content: '';
        inset: 0 calc(var(--gutter) * -1);
        background-color: var(--theme-color-background);
        z-index: -1;
    }

    @include media('>=lg') {
        padding-block: rem(24);
    }
}

.title {
    @include font;
    margin-block: 0;
    grid-column: 1 / -1;
    color: var(--theme-color-on-background);

    @include media('>=lg') {
        grid-column: 1 / span 6;
    }
}

.link {
    @include font;
    text-align: right;
    grid-column: 1 / -1;
    text-decoration: none;
    color: var(--theme-color-on-background);

    @include media('>=lg') {
        grid-column: 6 / -1;
    }
}
</style>
