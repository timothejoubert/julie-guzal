import { filter } from '@prismicio/client'
import type { ProjectPageDocument } from '~/prismicio-types'
import type { PrismicFetchDocumentsOptions } from '~/composables/use-prismic-fetch-documents'

export function usePrismicFetchProjects(options: PrismicFetchDocumentsOptions = {}, isArchived = false) {
    return usePrismicFetchDocuments<ProjectPageDocument>('project_page', {
        orderings: [
            {
                field: 'my.project_page.order_date',
                direction: 'desc',
            },
            {
                field: 'my.project_page.creation_date',
                direction: 'desc',
            },
        ],
        pageSize: options.pageSize || 20,
        filters: [filter.at('my.project_page.archived', isArchived)],
        ...options,
    })
}
