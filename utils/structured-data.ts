import { toRaw, toValue, type MaybeRef } from 'vue'

type StructuredDataContent = { [key: string]: unknown }

const isNullishValue = (v: unknown): boolean => {
    if (v === null || v === undefined) return true
    if (typeof v === 'string') return !v.trim()
    if (Array.isArray(v)) return !v.length || v.every(isNullishValue)
    if (typeof v === 'object') return !Object.keys(v).length

    return false
}

function removeNullishValues(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(removeNullishValues).filter(v => !isNullishValue(v))
    }

    if (value && typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value as StructuredDataContent)
                .map(([key, v]) => [key, removeNullishValues(v)])
                .filter(([, v]) => !isNullishValue(v)),
        )
    }

    return value
}

export function getJsonLdScriptContent(content: MaybeRef<StructuredDataContent | unknown[]>) {
    const value = toRaw(toValue(content))

    const json = JSON.stringify(removeNullishValues(value))
        // Remove auto genid from structured data. It could lead Google to follow them as links, plus it is useless.
        .replaceAll(/"@id":\s?"\/api\/\.well-known\/genid\/([^"]+)",\s*/gm, '')
        // Escape "<" so that CMS content (e.g. "</script>") can't break out of the script tag
        .replaceAll('<', '\\u003c')

    return {
        type: 'application/ld+json',
        innerHTML: json,
    }
}
