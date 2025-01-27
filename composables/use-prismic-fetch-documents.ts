import { usePrismic } from '@prismicio/vue'
import type { BuildQueryURLArgs } from '@prismicio/client'
import type { PrismicDocumentType } from '~/types/api'
import { prismicDocumentRoutes } from '~/utils/prismic/route-resolver'
import type { AllDocumentTypes } from '~/prismicio-types'
import { generateHashFromObject } from '~/utils/string/generate-hash-from-object'

export type PrismicFetchDocumentsOptions = Partial<BuildQueryURLArgs>

const DEFAULT_SIZE = 10

export function usePrismicFetchDocuments<T extends AllDocumentTypes>(prismicDocument: PrismicDocumentType, options: PrismicFetchDocumentsOptions = {}) {
    // Stored dataKey forEach different fetch endpoint and fetch options
    const hash: string[] = [prismicDocument]
    if (Object.keys(options).length) hash.push(generateHashFromObject(options))
    const key = `fetch-documents-${hash.join('-')}`

    const size = options.pageSize || DEFAULT_SIZE

    const nuxtApp = useNuxtApp()

    // TODO: request with slow network connexion don't return data
    return useAsyncData(key, async () => {
        const prismicClient = usePrismic().client
        const { fetchLocaleOption } = useLocale()

        return await prismicClient.getByType<T>(prismicDocument, {
            ...fetchLocaleOption.value,
            pageSize: size, // default 20
            routes: prismicDocumentRoutes,
            // brokenRoute: '/404',
            ...options,
        })
    }, {
        getCachedData: key => nuxtApp.static.data[key] ?? nuxtApp.payload.data[key], // no re-fetch data if the key is already in the payload
        dedupe: 'defer', // wait for the first request to finish before making another request
        deep: false,
        // lazy: true,
        // default: () => {
        //     return {
        //         page: options.page || 0,
        //         results_per_page: 0,
        //         results_size: 0,
        //         total_results_size: size,
        //         total_pages: 0,
        //         next_page: null,
        //         prev_page: null,
        //         results: [...Array(size).keys()].map(() => null),
        //     }
        // },
    })
}
