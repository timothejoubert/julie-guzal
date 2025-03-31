// Preview url example:
// https://julie-guzal.netlify.app
// /prismic-preview?token=https://julie-guzal.prismic.io/previews/Z6KzYREAAC0ACYuj:Z6OpxBEAACcACyfI?websitePreviewId=Z6FQNhEAACwAB0Gl&documentId=Z5vznhEAAC0A_xZN

export function usePrismicPreviewRoute() {
    const route = useRoute()

    const searchParams = computed(() => new URLSearchParams(route.fullPath))
    const documentID = computed(() => searchParams.value.get('documentId'))
    const previewToken = computed(() => searchParams.value.get('token'))
    const websitePreviewId = computed(() => searchParams.value.get('websitePreviewId'))

    const runtimeConfig = useRuntimeConfig()
    const previewPath = runtimeConfig.public?.prismic?.preview

    const isPreview = computed(() => {
        return route.path.includes(`/${previewPath}`) && !!documentID.value
    },
    )

    return { isPreview, documentID, previewToken, websitePreviewId }
}
