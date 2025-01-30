// https://prismic.io/docs/route-resolver#resolvers
// https://prismic.io/docs/nuxt-3-define-routes
import { extractValueBetweenOccurrence } from '#root/utils/string/extract'
import { I18N_LOCALES } from '#root/i18n/i18n.config'
import type { PrismicDocumentType } from '~/types/api'

export interface PrismicDocumentRoute {
    type: PrismicDocumentType
    path: string
    alias?: string[]
}

export const prismicDocumentRoutes: PrismicDocumentRoute[] = [
    {
        type: 'home_page',
        path: '/:lang?',
    },
    {
        type: 'gallery_page',
        path: '/:lang?/gallery',
    },
    {
        type: 'lab_page',
        path: '/:lang?/lab',
    },
    {
        type: 'contact_page',
        path: '/:lang?/contact',
    },
    {
        type: 'project_page',
        path: '/:lang?/project/:uid',
    },
]

export function isPrismicDocumentRoute(route: object): route is PrismicDocumentRoute {
    return ('type' in route) && prismicDocumentRoutes.map(r => r.type).includes(route.type as PrismicDocumentType) && ('path' in route)
}

export const prismicDocumentName = prismicDocumentRoutes.reduce((acc, route) => {
    const type = route.type
    Object.assign(acc, { [type]: type })

    return acc
}, {} as Record<PrismicDocumentType, PrismicDocumentType>)

export const prismicDocumentRoute = prismicDocumentRoutes.reduce((acc, route) => {
    const type = route.type
    Object.assign(acc, { [type]: route })

    return acc
}, {} as Record<PrismicDocumentType, PrismicDocumentRoute>)

// TODO: find item by alias too
export function getDocumentTypeByUrl(path: string) {
    const firstSegment = extractValueBetweenOccurrence(path, '/', [1, 2]) || ''

    const route = prismicDocumentRoutes.find((prismicRoute) => {
        if (path === prismicRoute.path) return true

        // Replace locale or uid if exist
        const hasLocale = I18N_LOCALES.includes(firstSegment as (typeof I18N_LOCALES)[number])
        const dynamicUid = prismicRoute.path?.includes(':uid') && path.substring(path.lastIndexOf('/') + 1)

        const filteredPath = prismicRoute.path
            ?.replace('/:lang?', hasLocale ? `/${firstSegment}` : '')
            .replace(':uid', dynamicUid || '') || '/'

        return path === filteredPath
    })

    if (route) return route.type

    return undefined
}

export function getDocumentRoutePath(documentType: PrismicDocumentType) {
    const currentRoute = prismicDocumentRoutes.find(route => route.type === documentType)

    return currentRoute?.path?.replace('/:lang?', '').replace(':uid', '')
}
