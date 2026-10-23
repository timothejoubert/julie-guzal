// Collapse whitespace (line breaks from rich text) and cut on a word boundary, e.g. for meta descriptions
export function truncate(value: string | undefined, maxLength = 160) {
    const text = value?.replace(/\s+/g, ' ').trim()
    if (!text || text.length <= maxLength) return text

    // Last space within maxLength: the text before it (plus the ellipsis) fits in maxLength
    const lastSpace = text.slice(0, maxLength).lastIndexOf(' ')
    const cut = lastSpace > 0 ? text.slice(0, lastSpace) : text.slice(0, maxLength - 1)

    return `${cut.replace(/[\s,;:.—–-]+$/, '')}…`
}
