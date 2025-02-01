<script  lang="ts" setup>
import { getDocumentTypeByUrl } from '~/utils/prismic/route-resolver'

const route = useRoute()

if (typeof route.name !== 'string' || route.name?.includes('uid__')) {
    const pageType = getDocumentTypeByUrl(route.path)

    if (!pageType) {
        throw createError({
            statusCode: 404,
            statusMessage: `can't getDocumentTypeByUrl on ${route.path}`,
        })
    }

    const { webResponse } = await usePrismicFetchPage(pageType)
    useCurrentPage({ webResponse })
}
</script>

<template>
    <ClientOnly>
        <VGridVisualizer />
        <VMediaViewer />
    </ClientOnly>

    <NuxtLoadingIndicator color="white" />
    <VTopBar />
    <NuxtPage />
</template>

<!-- <style lang="scss" module></style> -->
