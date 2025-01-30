<script  lang="ts" setup>
import type { SharedSlice } from '@prismicio/types'

defineProps<{
    slice: SharedSlice
    tag?: string
}>()
</script>

<template>
    <component
        :is="tag || 'section'"
        :data-slice-type="slice.slice_type"
        :data-slice-variation="slice.variation"
    >
        <slot />
    </component>
</template>
