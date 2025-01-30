<script  lang="ts" setup>
import type { ContactPageDocument } from '~/prismicio-types'

const props = defineProps<{
    document: ContactPageDocument
}>()

const data = computed(() => props.document.data)
</script>

<template>
    <div
        class="grid"
        :class="$style.root"
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
            v-if="data.right_column"
            :class="$style.right_column"
        >
            <VText
                v-if="data.right_column.content"
                :content="data.right_column.content"
                :class="$style.text"
            />
            <VPrismicImage
                v-else-if="data.right_column.image"
                :document="data.right_column.image"
                fit="crop"
                ar="684:414"
                width="684"
                height="414"
                :class="$style.image"
                sizes="xs:100vw sm:100vw md:100vw lg:50vw xl:50vw xxl:50vw hq:50vw qhd:50vw"
            />
        </div>
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;
@use 'assets/scss/variables/fonts' as *;
@use 'assets/scss/mixins/include-media' as *;

.root {
    position: relative;
    margin-top: rem(146);
    padding-top: rem(32);
    min-height: 50vh;

    &::before {
        position: absolute;
        content: '';
        top: 0;
        left: calc(var(--gutter) * -1);
        right: calc(var(--gutter) * -1);
        height: 1px;
        background-color: var(--theme-color-on-background);
    }
}

.column {
    grid-column: span 7;

    @include media('>=lg') {
        grid-column: span 3;
    }
}

.title {
    font-family: $font-suisse-family;
    font-size: rem(16);
    line-height: 1.25;
    font-weight: 400;
}

.text {
    font-family: $font-suisse-family;
    font-size: rem(12);
    line-height: 1.25;
    font-weight: 400;
    margin-top: rem(25);
}

.right_column {
    grid-column: 1 / -1;

    @include media('>=lg') {
        grid-column: span 3;
    }
}
</style>
