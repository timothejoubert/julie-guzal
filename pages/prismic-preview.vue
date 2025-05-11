<script  lang="ts" setup>
const { webResponse } = await usePrismicFetchPage(undefined)
// preview url exemple
// /prismic-preview?token=https://julie-guzal.prismic.io/previews/Z6OzehEAACoACzli:Z6OzhxEAACoACzl4?websitePreviewId%3DZ6FQNhEAACwAB0Gl&documentId=Z5vznhEAAC0A_xZN

console.log('preview', webResponse)

const route = useRoute()
onMounted(async () => {
    if (webResponse?.url) {
        await navigateTo({
            path: webResponse.url,
            query: {
                ...route.query,
            },
        })
    }
})
</script>

<template>
    <div>
        <h1 class="text-h2">
            Preview Page...
        </h1>
        <pre>document: {{ webResponse }}</pre>
    </div>
</template>
