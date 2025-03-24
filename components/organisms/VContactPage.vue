<script  lang="ts" setup>
import type { ContactPageDocument } from '~/prismicio-types'
import themes from '~/assets/scss/export/_themes.module.scss'

const props = defineProps<{
    document: ContactPageDocument
}>()

const data = computed(() => props.document.data)
const rightColumn = computed(() => data.value.right_column?.[0])

useHead({
    meta: [{
        name: 'theme-color',
        content: themes['light-color-primary'],
    }],
})
</script>

<template>
    <div :class="$style.root">
        <VTopBar
            :document="document"
            :class="$style['top-bar']"
        />
        <main
            class="grid"
            :class="$style.main"
        >
            <div
                v-for="(column, index) in data.columns"
                :key="index"
                :class="$style.column"
            >
                <div :class="$style.title">
                    {{ column.title }}
                </div>
                <VText
                    :content="column.content"
                    :class="$style.text"
                />
            </div>
            <div
                v-if="rightColumn"
                :class="$style.right__column"
            >
                <VPrismicImage
                    v-if="rightColumn.image?.url"
                    :document="rightColumn.image"
                    :class="$style.right__column__image"
                    sizes="xs:90vw md:90vw lg:25vw xxl:25vw qhd:25vw"
                />
                <VText
                    v-else-if="rightColumn.content"
                    :content="rightColumn.content"
                    :class="$style.right__column__text"
                />
            </div>
            <VText
                v-if="data.credits"
                :content="data.credits"
                :class="$style.credits"
                :rich-text-serializer="null"
            />
        </main>
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/flex-grid' as *;
@use 'assets/scss/variables/fonts' as *;
@use 'assets/scss/mixins/theme' as *;

.root {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    background-color: var(--theme-color-primary);
    color: var(--theme-color-on-primary);

    --v-prismic-link-icon-secondary-color: var(--theme-color-on-primary);
}

.top-bar {
    --v-top-bar-title-max-width: 9ch;

    & :global(.v-nav) {
        @include theme('dark')
    }

    @include media('>=md') {
        & :global(.v-nav) {
            @include theme('light')
        }
    }
}

.main {
    position: relative;
    min-height: 50vh;
    padding-top: rem(32);
    margin-top: auto;

    &::before {
        position: absolute;
        top: 0;
        right: calc(var(--gutter) * -1);
        left: calc(var(--gutter) * -1);
        height: 1px;
        background-color: currentcolor;
        content: '';
    }

    @include media('>=lg') {
        grid-template-rows: 1fr min-content;
    }
}

.column {
    grid-column: span 11;

    @include media('<md') {
        &:nth-child(2),
        &:nth-child(3) {
            margin-top: rem(40);
            grid-column: span 6;
        }
    }

    @include media('>=md') {
        grid-column: span 3;

        &:first-child {
          grid-column: span 6;
        }
    }

    @include media('>=lg') {
        grid-column: span 3;

        &:first-child {
            grid-column: span 3;
        }
    }
}

.title {
    max-width: 30ch;
    min-height: 2lh;
    font-family: $font-suisse-family;
    font-size: rem(20);
    font-weight: 400;
    line-height: 1.25;
    text-wrap: balance;

    @include media('>=md') {
        max-width: flex-grid(2, 3);
        font-size: rem(16);
    }
}

@mixin font-body {
    font-family: $font-suisse-family;
    font-size: rem(16);
    font-weight: 400;
    line-height: 1.35;

    @include media('>=md') {
        font-size: rem(12);
    }
}

.text,
.text a,
.text p {
    margin-top: rem(25);

    @include font-body;
}

.text button {
    color: var(--theme-color-on-background);

    @include font-body;
}

.text a {
    color: inherit;
    text-decoration: none;
}

.right__column {
    display: flex;
    align-items: flex-end;
    margin-top: rem(48);
    grid-column: 4 / -1;

    @include media('>=md') {
        margin-top: rem(126);
    }

    @include media('>=lg') {
        margin-top: 0;
        grid-column: span 3;
    }
}

.right__column__text {
    font-family: $font-lecturis-family;
    font-size: rem(28);
    font-weight: 400;
    line-height: 1.4;

    > * {
        margin-bottom: 0;
    }
}

.right__column__image {
    @include media('<lg') {
        display: none;

        --v-img-display: none;
    }
}

.credits {
    margin-top: rem(24);
    grid-column: 1 /-1;

    @include font-body;

    @include media('>=md') {
        margin-top: 0;
    }

    @include media('>=lg') {
        grid-column: 1 / 9;
    }
}
</style>
