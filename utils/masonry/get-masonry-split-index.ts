export interface MasonryItem {
    /** Intrinsic media width, in px (or any unit, only the ratio matters unless `maxWidth` is set) */
    width: number
    /** Intrinsic media height */
    height: number
    /** Rendered width limit in px: images are never upscaled beyond their `width` attribute (`max-width: 100%`) */
    maxWidth?: number
}

export interface MasonryMetrics {
    /** Width of one column, in px */
    columnWidth: number
    /** Vertical space after each item, in px */
    gap: number
    /** Extra space at the top of the second column, in px */
    offset: number
}

/**
 * Splits `items` into two contiguous columns (first column = items[0, index), second = items[index, end))
 * and returns the index where the second column starts.
 *
 * Heights are derived from the media dimensions only (never measured), so the result doesn't depend on
 * when images or async components load. The split minimises the tallest column, second column offset
 * included, which is what the previous CSS `column-count` balancing produced.
 */
export function getMasonrySplitIndex(items: MasonryItem[], { columnWidth, gap, offset }: MasonryMetrics): number {
    if (items.length < 2) return items.length

    const heights = items.map((item) => {
        const width = Math.min(columnWidth, item.maxWidth || Infinity)
        return (width * item.height) / item.width + gap
    })
    const total = heights.reduce((sum, height) => sum + height, 0)

    let splitIndex = items.length
    let smallestTallest = Infinity
    let firstColumnHeight = 0

    for (let index = 1; index < items.length; index++) {
        firstColumnHeight += heights[index - 1]!
        const tallest = Math.max(firstColumnHeight, offset + total - firstColumnHeight)

        if (tallest < smallestTallest) {
            smallestTallest = tallest
            splitIndex = index
        }
    }

    return splitIndex
}
