import { usePrismic } from '@prismicio/vue'
import type { PrismicDocumentType } from '~/types/api'
import { isDynamicDocument, isExistingDocumentType } from '~/utils/prismic/document-type'
import type { AllDocumentTypes } from '~/prismicio-types'

export type PrismicWebResponse = Awaited<ReturnType<typeof usePrismicFetchPage>>['webResponse']

// Requests started ahead of navigation (usePrismicPrefetchPage), reused by usePrismicFetchPage if still pending
const pendingPrefetches = new Map<string, Promise<unknown>>()

export function getPrismicPageDataKey(prismicDocument: PrismicDocumentType | undefined, uid?: string) {
    return `page-${prismicDocument || ''}-${uid || 'single-document'}`
}

// Composables (usePrismic, useLocale) must be called during setup: callers pass what they captured there
function useFetchPrismicDocument() {
    const prismicClient = usePrismic().client
    const { fetchLocaleOption } = useLocale()

    return (prismicDocument: PrismicDocumentType | undefined, uid: string | undefined) =>
        fetchPrismicDocument(prismicClient, { ...fetchLocaleOption.value, brokenRoute: '/404' }, prismicDocument, uid)
}

function fetchPrismicDocument(
    prismicClient: ReturnType<typeof usePrismic>['client'],
    prismicFetchOptions: Record<string, unknown>,
    prismicDocument: PrismicDocumentType | undefined,
    uid: string | undefined,
) {
    if (prismicDocument && uid && isDynamicDocument(prismicDocument)) {
        return prismicClient.getByUID(prismicDocument, uid, prismicFetchOptions)
    }
    else if (prismicDocument && isExistingDocumentType(prismicDocument)) {
        return prismicClient.getSingle(prismicDocument, prismicFetchOptions)
    }
    return Promise.resolve({ data: '' })
}

// Fetch a page document before navigating to it (e.g. on link hover) and store it where usePrismicFetchPage
// looks first (getCachedData → nuxtApp.payload.data), so the page renders without waiting for the API.
export function usePrismicPrefetchPage() {
    const nuxtApp = useNuxtApp()
    const { isPreview } = usePrismicPreviewRoute()
    const fetchDocument = useFetchPrismicDocument()

    return function prefetch(prismicDocument: PrismicDocumentType | undefined, uid?: string) {
        if (import.meta.server || isPreview.value) return

        const key = getPrismicPageDataKey(prismicDocument, uid)
        if (nuxtApp.payload.data[key] || nuxtApp.static.data[key] || pendingPrefetches.has(key)) return

        const request = fetchDocument(prismicDocument, uid)
            .then((document) => {
                nuxtApp.payload.data[key] = document
            })
            .catch(() => {}) // the page fetches it again on navigation
            .finally(() => pendingPrefetches.delete(key))

        pendingPrefetches.set(key, request)
    }
}

export async function usePrismicFetchPage<T extends AllDocumentTypes>(prismicDocument: PrismicDocumentType | undefined) {
    const route = useRoute()
    const routeUid = route.params?.uid || ''
    const uid = Array.isArray(routeUid) ? routeUid.at(-1) : routeUid // get the last uid when route has subPage,

    const { documentId, isPreview } = usePrismicPreviewRoute()

    const dataKey = getPrismicPageDataKey(prismicDocument, uid || documentId.value)

    const prismicClient = usePrismic().client
    const fetchDocument = useFetchPrismicDocument()
    const nuxtApp = useNuxtApp()

    const { data: responseData, error } = await useAsyncData(dataKey, async () => {
        try {
            if (isPreview.value && documentId.value) {
                return await prismicClient.getByID(documentId.value, {
                    ...useLocale().fetchLocaleOption.value,
                    brokenRoute: '/404',
                })
            }

            // A prefetch for this page is still in flight: wait for it instead of sending the same request twice
            const pending = pendingPrefetches.get(dataKey)
            if (pending) {
                await pending
                const prefetched = nuxtApp.payload.data[dataKey]
                if (prefetched) return prefetched
            }

            return await fetchDocument(prismicDocument, uid)
        }
        catch (error) {
            console.error('Error during Prismic document fetch', error)
            return { data: '' }
        }
    }, {
        getCachedData: (key, nuxtApp) => nuxtApp.static.data[key] ?? nuxtApp.payload.data[key],
        dedupe: 'defer',
        deep: false,
    })

    return {
        webResponse: responseData.value as T,
        documentData: responseData.value?.data,
        error: error.value,
    }
}
