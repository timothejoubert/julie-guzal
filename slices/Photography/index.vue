<script setup lang="ts">
import type { Content } from '@prismicio/client'

const props = defineProps(getSliceComponentProps<Content.PhotographySlice>())
const primary = computed(() => props.slice.primary)

const emits = defineEmits<{
    onImgClicked: [index: number]
}>()

function onClick() {
    emits('onImgClicked', props.index)
}
</script>

<template>
    <VSlice :slice="slice">
        <VPrismicImage
            v-if="primary.image"
            :document="primary.image"
            @click="onClick"
        />
    </VSlice>
</template>
