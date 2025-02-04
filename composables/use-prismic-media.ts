import type { EmbedField, FilledLinkToMediaField, ImageField, LinkToMediaField } from '@prismicio/types'
import type { MaybeRef } from 'vue'
import { isFilledImageField, isFilledLinkToMediaField, isVideoEmbedField } from '~/utils/prismic/guard'

export type staticMedia = {
    src: string
    width?: string | number
    height?: string | number
    type: 'image' | 'public_image' | 'video' | 'public_video' | 'embed_video' | 'audio'
}

export type PossibleMedia = LinkToMediaField | EmbedField | ImageField | staticMedia
// export type PossibleVideoMedia =

function getLinkToMediaFieldType(field: FilledLinkToMediaField) {
    const extIndex = field.url.lastIndexOf('.') + 1
    const extension = field.url.slice(extIndex - field.url.length).toLowerCase()

    if (['mp4', 'mov', 'ogg', 'webm'].includes(extension)) return 'video'
    else if (['jpg', 'jpeg', 'webp', 'aviff'].includes(extension)) return 'image'

    return
}

type UsePrismicMediaDocument = MaybeRef<PossibleMedia | null | undefined>

export function usePrismicMedia(document: UsePrismicMediaDocument) {
    const mediaType = computed(() => {
        const doc = toValue(document)

        if (!doc) return 'no document'
        else if (typeof doc === 'object' && 'type' in doc && doc.type) return doc.type
        else if (isFilledLinkToMediaField(doc)) return getLinkToMediaFieldType(doc)
        else if (isVideoEmbedField(doc)) return 'video'
        else if (isFilledImageField(doc)) return 'image'

        return 'unknown'
    })

    const url = computed(() => {
        const doc = toValue(document)

        if (!doc) return
        else if (isFilledLinkToMediaField(doc)) return doc.url
        else if (isVideoEmbedField(doc)) return doc.embed_url
        else if (isFilledImageField(doc)) return doc.url

        return 'unknown'
    })

    return { mediaType, url }
}
