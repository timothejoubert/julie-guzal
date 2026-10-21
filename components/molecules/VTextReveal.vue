<script  lang="ts" setup>
import type { VTextContent } from '~/components/atoms/VText.vue'
import { getText } from '~/utils/prismic/prismic-rich-field.js'

const props = defineProps<{
    reveal?: boolean
    content: VTextContent
    tag?: string
}>()

const _tag = computed(() => props.tag || 'div')
const text = computed(() => getText(props.content))

// Split chars are hidden until revealed: show them when JS is disabled
useHead({
    noscript: [{ innerHTML: '<style>[data-content]::after{translate:0 0 !important}</style>' }],
})
</script>

<template>
    <!-- Rendered split on the server too, so hydration doesn't swap the markup (layout shift) -->
    <component
        :is="_tag"
        v-if="text"
        :class="$style.root"
    >
        <VSplitTextReveal
            :reveal="reveal"
            :content="text"
            render="all"
        />
    </component>
</template>

<style lang="scss" module>
.root {
    display: flex;
    flex-wrap: wrap;
}
</style>
