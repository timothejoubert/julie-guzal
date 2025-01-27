import type { PrismicDocumentType } from '~/types/api'
import { prismicDocumentRoutes, prismicDocumentName } from '~/utils/prismic/route-resolver'

export function isPrismicDocument() {}

export function isExistingDocumentType(type: string) {
    return !!prismicDocumentRoutes.find(route => route.type === type)
}

export function isHomeDocument(type: string) {
    return type === prismicDocumentName.home_page
}

export function isDefaultDocument(type: string) {
    return type === prismicDocumentName.default_page
}

export function isProjectDocument(type: string) {
    return type === prismicDocumentName.project_page
}

export function isProjectListingDocument(type: string) {
    return type === prismicDocumentName.project_listing_page
}

export function isDynamicDocument(type: PrismicDocumentType) {
    return isProjectDocument(type) || isDefaultDocument(type)
}
