import type { KeyTextField, RichTextField } from '@prismicio/types'
import { asText } from '@prismicio/helpers'

export function getText(field: KeyTextField | RichTextField | null | undefined | string) {
    if (!field) return
    else if (typeof field === 'string') return field
    else if (asText(field)) return asText(field)

    return
}
