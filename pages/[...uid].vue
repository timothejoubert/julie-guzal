<script lang="ts" setup>
import { getDocumentTypeByUrl } from '~/utils/prismic/route-resolver'
import { defaultPageTransition } from '~/transitions/default-page-transition'

definePageMeta({
    pageTransition: defaultPageTransition,
})

const route = useRoute()
const pageType = getDocumentTypeByUrl(route.path)

if (!pageType) {
    throw createError({
        statusCode: 404,
        statusMessage: `can't getDocumentTypeByUrl on ${route.path}`,
    })
}

const { webResponse, error } = await usePrismicFetchPage(pageType)

if (error) {
    showError(error)
}
else if (!webResponse) {
    showError({ status: 404, statusText: 'can\'t find prismic document' })
}

await usePrismicSeoMeta(webResponse)
const alternateLinks = usePrismicHead(webResponse)

const runtimeConfig = useRuntimeConfig()
const title = computed(() => {
    const pageTitle = webResponse?.data.meta_title || webResponse?.data.title
    return `${pageTitle} | ${runtimeConfig.public.site.name}`
})

usePage({
    title: title.value,
    webResponse,
    alternateLinks,
})

useHead({
    title: title.value,
})
</script>

<template>
    <div>
        <header>
            <VTopBar :title="webResponse?.data?.title" />
        </header>
        <div>{{ pageType }}</div>
        <pre>{{ webResponse }}</pre>
    </div>
</template>
