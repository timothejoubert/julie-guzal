<script  lang="ts" setup>
import { getDocumentTypeByUrl } from '~/utils/prismic/route-resolver'
import type { ReachableDocument } from '~/types/api'

const route = useRoute()
const isWildCardPage = route.matched?.find(match => match.path === '/:uid(.*)*')

if (isWildCardPage) {
    // Set current page for component data outside pages
    const pageType = getDocumentTypeByUrl(route.path)

    const { webResponse } = await usePrismicFetchPage<ReachableDocument>(pageType)
    if (webResponse) useCurrentPage().value = { webResponse }
}

const appConfig = useAppConfig()
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
