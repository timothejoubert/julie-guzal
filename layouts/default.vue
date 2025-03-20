<script  lang="ts" setup>
import { getDocumentTypeByUrl } from '~/utils/prismic/route-resolver'
import { usePrismicPreviewRoute } from '~/composables/use-prismic-preview-route'
import { getScrollBarWidth } from '~/utils/scroll-bar'

const route = useRoute()
const { isPreview } = usePrismicPreviewRoute()

// Set current page for component data outside pages
const isWildCardPage = route.matched?.find(match => match.path === '/:uid(.*)*')
if (isWildCardPage || isPreview) {
    const pageType = isPreview ? 'preview' : getDocumentTypeByUrl(route.path)

    if (pageType) {
        const { webResponse } = await usePrismicFetchPage(pageType)
        useCurrentPage({ webResponse })
    }
}

// Global data
onMounted(() => {
    document.body.style.setProperty('--scroll-bar-width', getScrollBarWidth())
})

// const appConfig = useAppConfig()
</script>

<template>
    <ClientOnly>
        <VGridVisualizer />
        <VMediaViewer />
        <VToast />
        <VLoadingIndicator />
    </ClientOnly>

    <LazyVSplashScreen />
    <!--    <LazyVSplashScreen v-if="appConfig.featureFlags.splashScreen" /> -->
    <NuxtPage />
</template>
