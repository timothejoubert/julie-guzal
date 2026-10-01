import type { MaybeRefOrGetter, Ref } from 'vue'
import { getMasonrySplitIndex } from '~/utils/masonry/get-masonry-split-index'
import type { MasonryItem, MasonryMetrics } from '~/utils/masonry/get-masonry-split-index'

interface UseMasonryColumnsOptions {
    /** First column element: its width and first item margin give the metrics */
    firstColumn: Readonly<Ref<HTMLElement | null | undefined>>
    /** Second column element: its `padding-top` is the offset */
    secondColumn: Readonly<Ref<HTMLElement | null | undefined>>
    /** Media query matching the two-column layout (below it, the columns are stacked and the split doesn't matter) */
    media: string
    /** Metrics used before the columns can be measured (SSR, first render) */
    initialMetrics: MasonryMetrics
}

/**
 * Two-column masonry: returns the index where the second column starts.
 *
 * The split is computed from the media dimensions, so it's the same whatever the loading order. It's only
 * recomputed when the items change or the column width changes (debounced resize), and only while the
 * layout has two columns.
 */
export function useMasonryColumns(items: MaybeRefOrGetter<MasonryItem[]>, options: UseMasonryColumnsOptions) {
    const metrics = shallowRef<MasonryMetrics>(options.initialMetrics)
    const splitIndex = computed(() => getMasonrySplitIndex(toValue(items), metrics.value))

    const isTwoColumns = useMediaQuery(options.media)

    function measure() {
        const first = options.firstColumn.value
        const second = options.secondColumn.value
        if (!isTwoColumns.value || !first || !second) return

        const firstItem = first.firstElementChild
        const next: MasonryMetrics = {
            columnWidth: first.clientWidth,
            gap: firstItem ? parseFloat(getComputedStyle(firstItem).marginBottom) || 0 : 0,
            offset: parseFloat(getComputedStyle(second).paddingTop) || 0,
        }
        const current = metrics.value

        if (next.columnWidth === current.columnWidth && next.gap === current.gap && next.offset === current.offset) return
        metrics.value = next
    }

    const debouncedMeasure = useDebounceFn(measure, 150)
    // The column width only changes on resize: a ResizeObserver is cheaper than listening to every resize event
    useResizeObserver(options.firstColumn, debouncedMeasure)
    watch(isTwoColumns, measure)
    onMounted(measure)

    return { splitIndex }
}
