<script  lang="ts" setup>
import { getDocumentTypeByUrl } from '~/utils/prismic/route-resolver'


// Set current page for component data outside pages
callOnce(async () => {
    const route = useRoute()
    const isWildCardPage = route.matched?.find(match => match.path === '/:uid(.*)*')
    
    if (isWildCardPage) {
        const pageType = getDocumentTypeByUrl(route.path)

        if (pageType) {
            const { webResponse } = await usePrismicFetchPage(pageType)
            useCurrentPage({ webResponse })
        }
    }
})

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
