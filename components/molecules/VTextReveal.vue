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

const isMounted = ref(false)
onMounted(() => {
    isMounted.value = true
})
</script>

<template>
    <VText
        v-if="!isMounted"
        :tag="_tag"
        :class="[$attrs.class, $style.root, $style['root--server']]"
        :content="text"
    />
    <component
        :is="_tag"
        v-else-if="text"
        :class="[$attrs.class, $style.root, $style['root--client']]"
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
    &--client {
        display: flex;
        flex-wrap: wrap;
    }
}
</style>
