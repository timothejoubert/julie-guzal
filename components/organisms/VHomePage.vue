<script  lang="ts" setup>
import themes from 'assets/scss/export/_themes.module.scss'
import type { HomePageDocument } from '~/prismicio-types'
import { components } from '~/slices'

const props = defineProps<{
    document: HomePageDocument
}>()

const slices = computed(() => props.document.data.slices)

useHead({
    meta: [{
        name: 'theme-color',
        content: themes['dark-color-background'],
    }],
})
</script>

<template>
    <div>
        <VTopBar
            :document="document"
            :class="$style['top-bar']"
        />
        <LazySliceZone
            v-if="slices?.length"
            :slices="slices"
            :components="components"
            wrapper="main"
        />
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/mixins/theme' as *;
@use 'assets/scss/mixins/include-media' as *;

.top-bar {
    & :global(.v-nav) {
        @include theme('light')
    }

    @include media('>=md') {
        & :global(.v-nav) {
            @include theme('dark')
        }
    }
}
</style>
