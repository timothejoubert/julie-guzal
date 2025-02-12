<script  lang="ts" setup>
import Lenis from 'lenis'
import { getDocumentTypeByUrl } from '~/utils/prismic/route-resolver'
import { usePrismicPreviewRoute } from '~/composables/use-prismic-preview-route'
import VLoadingIndicator from '~/components/atoms/VLoadingIndicator.vue'

const route = useRoute()
const { isPreview } = usePrismicPreviewRoute()

if (typeof route.name !== 'string' || route.name?.includes('uid__') || isPreview) {
    const pageType = isPreview ? 'preview' : getDocumentTypeByUrl(route.path)

    if (pageType) {
        const { webResponse } = await usePrismicFetchPage(pageType)
        useCurrentPage({ webResponse })
    }
}

// Lenis
if (import.meta.client) {
    callOnce(() => {
        const lenis = new Lenis()

        function raf(time: DOMHighResTimeStamp) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)
    })
}

// SplashScreen
const state = useSplashScreenState()
</script>

<template>
    <ClientOnly>
        <VGridVisualizer />
        <VMediaViewer />
    </ClientOnly>

    <DevOnly>
        <VSplashScreen v-if="state !== 'done'" />
    </DevOnly>
    <VLoadingIndicator />
    <NuxtPage />
</template>
