export function useRouteQuery(queryKey: string, allowMultipleValue: boolean = false) {
    const route = useRoute()
    const router = useRouter()

    const queryValues = computed(() => {
        const query = route.query[queryKey]
        return (Array.isArray(query) ? query : [query]).filter(q => !!q)
    })

    const hasQuery = computed(() => !!queryValues.value.length)

    function getUpdatedQuery(query: string) {
        if (allowMultipleValue) {
            const current = [...queryValues.value.slice()]

            const hasQuery = current.includes(query)
            const newQueries = hasQuery ? current.filter(q => q !== query) : [...current, query]

            return newQueries.length ? { ...route.query, [queryKey]: newQueries } : route.query
        }
        else {
            return { ...route.query, [queryKey]: query }
        }
    }

    function toggleQuery(query: string) {
        router.replace({ ...route, query: getUpdatedQuery(query) })
    }

    return { queryValues, hasQuery, getUpdatedQuery, toggleQuery }
}
