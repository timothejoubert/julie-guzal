<script  lang="ts" setup>
import type { VSplitTextRender } from '~/components/atoms/VSplitText.vue'

const props = defineProps<{
    content: string
    render?: VSplitTextRender
    reveal?: boolean
}>()

const $style = useCssModule()
const rootClasses = computed(() => {
    return [$style.root, props.reveal && $style['root--reveal']]
})
</script>

<template>
    <VSplitText
        :content="content"
        :class="rootClasses"
        :render="render"
    />
</template>

<style lang="scss" module>
.root {
    > [data-content],
    &[data-content] {
        position: relative;
        display: inline-block;
        overflow: hidden;
        color: transparent;
        opacity: 1;
        white-space: pre-wrap;
    }

    > [data-content]::after,
    &[data-content]::after {
        position: absolute;
        color: var(--theme-color-on-background);
        content: attr(data-content);
        inset: 0;
        transition: translate 0.3s calc(var(--v-split-text-index) * 50ms) ease(out-quad);
        translate: 0 112%;
    }

    &--reveal > [data-content]::after,
    &--reveal[data-content]::after {
        translate: 0 0;
    }
}
</style>
