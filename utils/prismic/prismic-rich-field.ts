import type { KeyTextField, RichTextField } from '@prismicio/client'
import { asText } from '@prismicio/client'

export type PossibleTextField = KeyTextField | RichTextField | null | undefined | string

export function getText(field: PossibleTextField) {
    if (!field) return
    else if (typeof field === 'string') return field
    else if (asText(field)) return asText(field)

    return
}
