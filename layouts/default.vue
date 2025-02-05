<script  lang="ts" setup>
import { getDocumentTypeByUrl } from '~/utils/prismic/route-resolver'
import { usePrismicPreviewRoute } from '~/composables/use-prismic-preview-route'

const route = useRoute()
const { isPreview } = usePrismicPreviewRoute()
if (typeof route.name !== 'string' || route.name?.includes('uid__') || isPreview) {
    const pageType = isPreview ? 'preview' : getDocumentTypeByUrl(route.path)

    if (pageType) {
        const { webResponse } = await usePrismicFetchPage(pageType)
        useCurrentPage({ webResponse })
    }
}
</script>

<template>
    <ClientOnly>
        <VGridVisualizer />
        <VMediaViewer />
    </ClientOnly>

    <NuxtLoadingIndicator color="white" />
    <NuxtPage />
</template>
