<script  lang="ts" setup>
import type { LabPageDocument } from '~/prismicio-types'
import { components } from '~/slices'

const props = defineProps<{
    document: LabPageDocument
}>()

const data = computed(() => props.document.data)
const slices = computed(() => data.value.slices)
</script>

<template>
    <div>
        <VTopBar
            :document="document"
        />
        <main>
            <LazySliceZone
                v-if="slices?.length"
                :slices="slices"
                :components="components"
            />
        </main>
    </div>
</template>

<!-- <style lang="scss" module></style> -->
