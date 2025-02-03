<script lang="ts" setup>
import type { KeyTextField, RichTextField, RTTextNodeBase } from '@prismicio/types'
import { isRichTextFilled } from '~/utils/prismic/guard'

export type VTextContent = string | RichTextField | KeyTextField | null

interface VTextProps {
    tag?: string
    content?: VTextContent
}

const props = defineProps<VTextProps>()

const slots = useSlots()
const hasSlot = slots.default?.()

const isString = computed(() => typeof props.content === 'string')

const richText = computed(() => {
    return (isRichTextFilled(props.content) && props.content) || []
})

const flatRichTextContent = computed(() => {
    if (!props.tag) return

    const spans = (richText.value?.[0] as RTTextNodeBase)?.spans || []
    if (richText.value?.length > 1 || spans.length > 0) return

    return (richText.value?.[0] as { text: string })?.text
})
</script>

<template>
    <component
        :is="tag || 'div'"
        v-if="isString || hasSlot || flatRichTextContent"
        :class="$style.root"
    >
        <slot>{{ flatRichTextContent ? flatRichTextContent : content }}</slot>
    </component>
    <PrismicRichText
        v-else-if="!!richText[0]"
        :class="[$style.root, $attrs.class]"
        :field="richText"
        wrapper="div"
    />
</template>

<style lang="scss" module>
.root {
    *:first-child {
        margin-top: initial;
    }

    strong {
        font-weight: bold;
    }

    a {
        text-decoration: underline;
        text-decoration-thickness: 0.5px;
        text-underline-offset: 2px;
        color: inherit;
    }
}
</style>
