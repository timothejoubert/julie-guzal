import type {
    LocationAsRelativeRaw,
    _RouteRecordBase,
} from 'vue-router'
import type { ContentRelationshipField } from '@prismicio/types'
import { isContentRelationshipField, isPrismicDocument } from '~/utils/prismic/guard'
import type { PrismicReachableDocumentType, ReachableDocument } from '~/types/api'
import type { PrismicDocumentRoute } from '~/utils/prismic/route-resolver'
import { isPrismicDocumentRoute } from '~/utils/prismic/route-resolver'

export type PossibleRouteReference =
    string | undefined | null | LocationAsRelativeRaw | _RouteRecordBase | ReachableDocument | ContentRelationshipField<PrismicReachableDocumentType> | PrismicDocumentRoute

export function useLinkResolver(reference: PossibleRouteReference) {
    const siteUrl = useRuntimeConfig().public?.site.url
    const router = useRouter()

    const url = computed(() => {
        if (!reference) {
            return undefined
        }
        else if (typeof reference === 'object' && isPrismicDocumentRoute(reference)) {
            const { getLocalizedUrl } = useLocale()
            return getLocalizedUrl(reference.path.replace('/:lang?', ''))
        }
        else if (typeof reference === 'string') {
            const hasLang = reference.includes('/:lang?')
            if (!hasLang) return reference

            const { getLocalizedUrl } = useLocale()
            return getLocalizedUrl(reference.replace('/:lang?', ''))
        }
        else if ((isContentRelationshipField(reference) || isPrismicDocument(reference)) && 'url' in reference) {
            return reference.url
        }
        else if (typeof reference === 'object' && 'name' in reference) {
            return router.hasRoute(reference.name as string) ? router.resolve(reference)?.fullPath : undefined
        }
        // else if (typeof reference === 'object') {
        //     return router.resolve(reference as RouteLocationAsRelativeTyped)?.fullPath
        // }
        // else if return reference
    })

    const isRelative = computed(() => {
        const firstChar = toValue(url)?.charAt(0)
        if (firstChar && (firstChar === '/' || firstChar === '#')) return true

        return siteUrl && !!toValue(url)?.startsWith(siteUrl)
    })

    const isExternal = computed(() => !isRelative.value && !!toValue(url))

    return { isRelative, isExternal, url }
}
