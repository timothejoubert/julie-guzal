import type { AlternateLanguage } from '@prismicio/types'
import EventType from '~/constants/event-type'
import type { ReachableDocument } from '~/types/api'

export interface Page {
    title?: string
    webResponse?: ReachableDocument
    alternateLinks?: AlternateLanguage[]
}

type UsePageOptions = Page

export function usePage(options?: UsePageOptions) {
    const nextPage = useNextPage()
    const currentPage = useCurrentPage()

    nextPage.value = {
        title: options?.title,
        webResponse: options?.webResponse,
        alternateLinks: options?.alternateLinks,
    }

    function updateCurrentPage() {
        currentPage.value = { ...nextPage.value }
    }

    usePageTransitionEvent(EventType.PAGE_TRANSITION_AFTER_LEAVE, updateCurrentPage)
}
