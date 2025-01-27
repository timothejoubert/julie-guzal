<script  lang="ts" setup>
import type { TemplateElementRef } from '~/utils/ref/get-html-element'

defineProps({
    content: [String, null],
})

const reveal = defineModel<boolean>({ default: false })

const root = ref<TemplateElementRef>(null)

const $style = useCssModule()
const rootClasses = computed(() => {
    return [$style.root, reveal.value && $style['root--reveal']]
})

// watch(reveal, () => {
//     const elements = getHtmlElement(root.value)
// })
</script>

<template>
    <VSplitText
        v-if="content"
        ref="root"
        :content="content"
        :class="rootClasses"
    />
</template>

<style lang="scss" module>
.root {
    > *[data-char-content] {
        position: relative;
        display: inline-block;
        overflow: hidden;
        color: transparent;
        opacity: 1;
    }

    > *[data-char-content]::after {
        position: absolute;
        color: var(--color-main-darker-80);
        content: attr(data-char-content);
        inset: 0;
        transition: translate 0.3s calc(var(--data-char-index, 1) * 50ms) ease(out-quart);
        translate: 0 112%;
    }

    &--reveal *[data-char-content]::after {
        translate: 0 10%;
    }
}
</style>
