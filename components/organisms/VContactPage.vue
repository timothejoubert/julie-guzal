<script  lang="ts" setup>
import type { ContactPageDocument } from '~/prismicio-types'

const props = defineProps<{
    document: ContactPageDocument
}>()

const data = computed(() => props.document.data)
const rightColumn = computed(() => data.value.right_column?.[0])
</script>

<template>
    <div :class="$style.root">
        <VTopBar :class="$style['top-bar']" />
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
                :class="$style.right_column"
            >
                <VPrismicImage
                    v-if="rightColumn.image"
                    :document="rightColumn.image"
                    fit="crop"
                    ar="684:414"
                    width="684"
                    height="414"
                    :class="$style.right_column__image"
                    sizes="xs:90vw md:90vw lg:25vw xxl:25vw qhd:25vw"
                />
                <VText
                    v-else-if="rightColumn.content"
                    :content="rightColumn.content"
                    :class="$style.right_column__text"
                />
            </div>
            <VText
                v-if="data.credits"
                :content="data.credits"
                :class="$style.credits"
            />
        </main>
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/flex-grid' as *;
@use 'assets/scss/variables/fonts' as *;
@use 'assets/scss/mixins/theme' as *;

.root {
    @include theme(yellow);

    background-color: var(--theme-color-background);
    color: var(--theme-color-on-background);
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.top-bar {
    & :global(.v-nav) {
        @include theme('dark')
    }

    @include media('>=lg') {
        & :global(.v-nav) {
            @include theme('light')
        }
    }
}

.main {
    position: relative;
    margin-top: auto; //rem(146);
    padding-top: rem(32);
    min-height: 45vh;

    &::before {
        position: absolute;
        content: '';
        top: 0;
        left: calc(var(--gutter) * -1);
        right: calc(var(--gutter) * -1);
        height: 1px;
        background-color: currentColor;
    }

    @include media('>=lg') {
        grid-template-rows: 1fr min-content;
    }
}

.column {
    grid-column: span 11;

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
    font-family: $font-suisse-family;
    font-size: rem(16);
    line-height: 1.25;
    font-weight: 400;
    max-width: 30ch;

    @include media('>=lg') {
        max-width: flex-grid(2, 3);
    }
}

@mixin font-body {
    font-family: $font-suisse-family;
    font-size: rem(12);
    line-height: 1.35;
    font-weight: 400;
}

.text,
.text a,
.text p {
    @include font-body;
    margin-top: rem(25);
}

.text a {
    color: inherit;
    text-decoration: none;
}

.right_column {
    grid-column: 1 / -1;
    display: flex;
    align-items: flex-end;

    @include media('>=lg') {
        grid-column: span 3;
    }
}

.right_column__text {
    font-family: $font-lecturis-family;
    font-size: rem(28);
    line-height: 1.4;
    font-weight: 400;

    > * {
        margin-bottom: 0;
    }
}

.credits {
    @include font-body;
    grid-column: 1 /-1;

    @include media('>=lg') {
        grid-column: 1 / 9;
    }
}
</style>
