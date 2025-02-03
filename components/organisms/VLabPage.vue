<script  lang="ts" setup>
import type { LabPageDocument } from '~/prismicio-types'
import { components } from '~/slices'

const props = defineProps<{
    document: LabPageDocument
}>()

const data = computed(() => props.document.data)
const slices = computed(() => props.document.data.slices)
</script>

<template>
    <div>
        <VTopBar />
        <main>
            <pre>{{ data }}</pre>
            <LazySliceZone
                v-if="slices?.length"
                :slices="slices"
                :components="components"
            />
        </main>
    </div>
</template>

<!-- <style lang="scss" module></style> -->
