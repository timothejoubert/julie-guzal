import type { PrismicDocumentType, ReachableDocument } from '~/types/api'
import { isDynamicDocument, isExistingDocumentType } from '~/utils/prismic/document-type'
import { usePrismicPreviewRoute } from '~/composables/use-prismic-preview-route'

export type PrismicWebResponse = Awaited<ReturnType<typeof usePrismicFetchPage>>['webResponse']

export async function usePrismicFetchPage(prismicDocument: PrismicDocumentType) {
    const nuxtApp = useNuxtApp()
    const route = useRoute()
    const routeUid = route.params?.uid || ''
    const uid = Array.isArray(routeUid) ? routeUid.at(-1) : routeUid // get the last uid when route has subPage,

    const { documentId, isPreview } = usePrismicPreviewRoute()

    const key = `page-${prismicDocument}-${uid || documentId || 'single-document'}`

    const prismicClient = usePrismic().client

    const { data } = await useAsyncData(key, async () => {
        try {
            const { fetchLocaleOption } = useLocale()

            if (isPreview && documentId) {
                return await prismicClient.getByID(documentId, { ...fetchLocaleOption.value })
            }
            else if (uid && isDynamicDocument(prismicDocument)) {
                return await prismicClient.getByUID(prismicDocument, uid, { ...fetchLocaleOption.value })
            }
            else if (isExistingDocumentType(prismicDocument)) {
                return await prismicClient.getSingle(prismicDocument, { ...fetchLocaleOption.value })
            }
        }
        catch (error: unknown) {
            // @ts-expect-error cannot know the error type
            return { error: createError(error) }
        }
    }, {
        getCachedData: key => nuxtApp.static.data[key] ?? nuxtApp.payload.data[key], // no re-fetch data if the key is already in the payload
    })

    const response = data.value

    return {
        webResponse: (!!response && !('error' in response)) ? response as ReachableDocument : undefined,
        error: (!!response && ('error' in response)) ? response.error : undefined,
    }
}
