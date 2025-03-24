<script  lang="ts" setup>
import themes from 'assets/scss/export/_themes.module.scss'
import type { LabPageDocument } from '~/prismicio-types'
import { components } from '~/slices'

const props = defineProps<{
    document: LabPageDocument
}>()

const data = computed(() => props.document.data)
const slices = computed(() => data.value.slices)

useHead({
    meta: [{
        name: 'theme-color',
        content: themes['light-color-primary'],
    }],
})
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
