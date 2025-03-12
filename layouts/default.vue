<script  lang="ts" setup>
import { getDocumentTypeByUrl } from '~/utils/prismic/route-resolver'
import { usePrismicPreviewRoute } from '~/composables/use-prismic-preview-route'
import VLoadingIndicator from '~/components/atoms/VLoadingIndicator.vue'
import { getScrollBarWidth } from '~/utils/scroll-bar'

onMounted(() => {
    document.body.style.setProperty('--scroll-bar-width', getScrollBarWidth())
})
const route = useRoute()
const { isPreview } = usePrismicPreviewRoute()

if (typeof route.name !== 'string' || route.name?.includes('uid__') || isPreview) {
    const pageType = isPreview ? 'preview' : getDocumentTypeByUrl(route.path)

    if (pageType) {
        const { webResponse } = await usePrismicFetchPage(pageType)
        useCurrentPage({ webResponse })
    }
}

// SplashScreen
// const state = useSplashScreenState()
</script>

<template>
    <ClientOnly>
        <VGridVisualizer />
        <VMediaViewer />
        <VToast />
    </ClientOnly>

    <!--    <VSplashScreen v-if="state !== 'done'" /> -->
    <VLoadingIndicator />
    <NuxtPage />
</template>
