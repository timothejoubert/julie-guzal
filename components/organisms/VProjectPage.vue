<script  lang="ts" setup>
import type { ProjectPageDocument } from '~/prismicio-types'

const props = defineProps<{
    document: ProjectPageDocument
}>()
const headerImage =
</script>

<template>
    <div :class="$style.root">
        <VPrismicImage
            v-if="image"
            :document="image"
            fit="crop"
            ar="684:414"
            width="684"
            height="414"
            :class="$style.image"
            sizes="xs:100vw sm:100vw md:100vw lg:50vw xl:50vw xxl:50vw hq:50vw qhd:50vw"
        />
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;
@use 'assets/scss/mixins/include-media' as *;

.root {
}

</style>
