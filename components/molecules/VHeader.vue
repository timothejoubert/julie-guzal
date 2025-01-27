<script  lang="ts" setup>
import type { PropType } from 'vue'
import type { VTextContent } from '~/components/atoms/VText.vue'

const props = defineProps({
    title: [String, null],
    anchorTitle: Boolean,
    anchorHref: String,
    content: [String, null, Array] as PropType<VTextContent>,
})

const hasContent = computed(() => {
    const c = props.content
    return Array.isArray(c) ? !!c.length : !!c
})

const $style = useCssModule()
const rootClasses = computed(() => {
    return [$style.root, hasContent.value && $style['root--has-content']]
})

// TODO: use VRevealText
// const revealTitle = ref(true)
</script>

<template>
    <header
        :class="rootClasses"
        class="grid-width"
    >
        <h1
            v-if="title"
            :class="$style.title"
            class="text-h1"
        >
            {{ title }}
        </h1>
        <VText
            v-if="content"
            :content="content"
            :class="$style.content"
            class="text-body-lg"
            tag="p"
        />
    </header>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;
@use 'assets/scss/functions/flex-grid' as *;
@use 'assets/scss/mixins/include-media' as *;

.root {
    position: relative;
    padding-block: rem(72) rem(44);

    &::after {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: var(--theme-color-line);
        content: '';
    }

    @include media('>=md') {
        &--has-content {
            padding-block: rem(72) rem(26);
        }
    }
}

.title {
    // display: flex;
    // flex-wrap: wrap;
    margin-block: initial;
}

.content {
    width: calc(#{flex-grid-value(7, 11, '%', false)} + var(--gutter));
    margin-block: rem(62) rem(22);
}
</style>
