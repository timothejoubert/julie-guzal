import type {
    LinkField,
    PrismicDocument,
    FilledContentRelationshipField,
    FilledLinkToWebField,
    FilledLinkToMediaField,
    FilledImageFieldImage,
    EmbedField,
    VideoOEmbed, RichTextField,
} from '@prismicio/types'
import { LinkType, RichTextNodeType } from '@prismicio/types'
import { hasAllKeys, getObjWithAllKeys, isObject } from '~/utils/object/object-validation'
import type { CustomEmbedField } from '~/utils/prismic/prismic-media'

export function isPrismicDocument(entity: unknown): entity is PrismicDocument {
    return isObject(entity) && hasAllKeys(entity, ['id', 'type', 'last_publication_date', 'tags', 'lang'])
}

type LinkTypeValue = typeof LinkType[keyof typeof LinkType]

// Relation Link field
export function isLinkField(entity: unknown): entity is LinkField {
    if (!isObject(entity)) return false

    return hasAllKeys(entity, ['link_type']) && Object.values(LinkType).includes((entity as { link_type: LinkTypeValue }).link_type)
}

export function isContentRelationshipField(entity: unknown): entity is FilledContentRelationshipField {
    return isLinkField(entity) && hasAllKeys(entity, ['id', 'type', 'tags', 'lang'])
}

export function isFilledLinkToWebField(entity: unknown): entity is FilledLinkToWebField {
    return isLinkField(entity) && hasAllKeys(entity, ['url'])
}

export function isLinkToMediaField(entity: unknown): entity is FilledLinkToMediaField {
    return isLinkField(entity) && hasAllKeys(entity, ['name', 'kind', 'url', 'size'])
}

export function isFilledLinkToImage(entity: unknown): entity is FilledLinkToMediaField {
    return isLinkToMediaField(entity) && entity.kind === 'image'
}

// Media field
export function isFilledImageField(field: unknown): field is FilledImageFieldImage {
    return typeof field === 'object' && !!field && !!getObjWithAllKeys(field as Record<string, unknown>, ['alt', 'url', 'dimensions', 'copyright'])?.url
}

export function isFilledLinkToMediaField(field: unknown): field is FilledLinkToMediaField {
    return hasAllKeys(field, ['link_type', 'name', 'kind', 'url', 'size'])
}

export function isEmbedField(field: unknown): field is EmbedField {
    return hasAllKeys(field, ['html', 'width', 'height', 'embed_url'])
}

export function isVideoEmbedField(
    field: unknown,
): field is EmbedField<VideoOEmbed> & { video_id?: string | number, provider_name?: string } {
    return isEmbedField(field) && field.type === 'video'
}

export function isCustomEmbedVideo(field: unknown): field is CustomEmbedField {
    const typedField = isObject(field) && getObjWithAllKeys(field, ['video_id', 'provider_name'])
    return !!typedField && !!typedField?.video_id && !!typedField?.provider_name
}

// Merged media
export function isReferenceImage(field: unknown): field is FilledImageFieldImage | FilledLinkToMediaField {
    return isFilledLinkToImage(field) || isFilledImageField(field)
}

// RichText
const richTextKeys = Object.values(RichTextNodeType)

export function isRichTextFilled(el: unknown): el is RichTextField<'filled'> {
    const isArray = Array.isArray(el)
    if (!isArray || (isArray && !el?.length)) return false

    return el.some(item => richTextKeys.includes(item.type))
}
