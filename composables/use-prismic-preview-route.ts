import { getSelfObjectOrFirstMapObject } from '~/utils/object/get-self-object-or-first-map-object'

const DOCUMENT_ID_KEY = 'documentId'

export function usePrismicPreviewRoute() {
    const route = useRoute()

    let documentId = getSelfObjectOrFirstMapObject(route.params.documentId)
    const idIndex = route.fullPath.indexOf(DOCUMENT_ID_KEY)

    if (!documentId && idIndex !== -1) {
        const startIndex = idIndex + DOCUMENT_ID_KEY.length + 1
        const lastIndexParams = Math.max(route.fullPath.lastIndexOf('&'), route.fullPath.lastIndexOf('?'))

        documentId = route.fullPath.substring(startIndex, lastIndexParams > idIndex ? lastIndexParams : undefined)
    }

    const runtimeConfig = useRuntimeConfig()
    const previewPath = runtimeConfig.public?.prismic?.preview
    const isPreview = route.fullPath.includes(`/${previewPath}`) || !!documentId

    return { isPreview, documentId }
}
