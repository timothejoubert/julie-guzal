import type { EmbedField, ImageField, LinkToMediaField } from '@prismicio/types'
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

type UsePrismicMediaOptions = MaybeRef<PossibleMedia | null | undefined>

export function usePrismicMedia(document: UsePrismicMediaOptions) {
    const mediaType = computed(() => {
        const doc = toValue(document)
        console.log('usePrismicMedia mediaType', doc)

        if (!doc) return 'no document'
        else if ('type' in doc && doc.type) return doc.type
        else if (isFilledLinkToMediaField(doc)) return doc.kind
        else if (isVideoEmbedField(doc)) return 'video'
        else if (isFilledImageField(doc)) return 'image'

        return 'unknown'
    })

    return { mediaType }
}
