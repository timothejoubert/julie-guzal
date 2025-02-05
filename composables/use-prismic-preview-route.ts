// Preview url example:
// https://julie-guzal.netlify.app
// /prismic-preview?token=https://julie-guzal.prismic.io/previews/Z6KzYREAAC0ACYuj:Z6OpxBEAACcACyfI?websitePreviewId=Z6FQNhEAACwAB0Gl&documentId=Z5vznhEAAC0A_xZN

export function usePrismicPreviewRoute() {
    const route = useRoute()

    const searchParams = new URLSearchParams(route.fullPath)
    const documentID = searchParams.get('documentId')
    const previewToken = searchParams.get('token')
    const websitePreviewId = searchParams.get('websitePreviewId')

    const runtimeConfig = useRuntimeConfig()
    const previewPath = runtimeConfig.public?.prismic?.preview
    const isPreview = route.fullPath.includes(`/${previewPath}`) || !!documentID

    return { isPreview, documentID, previewToken, websitePreviewId }
}
