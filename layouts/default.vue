<script  lang="ts" setup>
import { getDocumentTypeByUrl } from '~/utils/prismic/route-resolver'
import { usePrismicPreviewRoute } from '~/composables/use-prismic-preview-route'

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

const appConfig = useAppConfig()

// const { data, error } = await useFetch('/api/run-github-actions-deploy', {
//     method: 'post',
// })

// console.log('post fetch response', data.value);
// console.log('post fetch error', error.value);
</script>

<template>
    <ClientOnly>
        <VGridVisualizer />
        <VMediaViewer />
        <VToast />
        <VLoadingIndicator />
    </ClientOnly>

    <LazyVSplashScreen v-if="appConfig.featureFlags.splashScreen" />
    <NuxtPage />
</template>
