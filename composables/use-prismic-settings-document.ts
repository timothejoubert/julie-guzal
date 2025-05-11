const DATA_KEY = 'settings-document'

export async function usePrismicSettingsDocument() {
    const prismicClient = usePrismic().client

    const { data } = await useAsyncData(DATA_KEY, async () => {
        return prismicClient.getSingle('settings')
    }, {
        getCachedData: (key, nuxtApp) => nuxtApp.static.data[key] ?? nuxtApp.payload.data[key],
        dedupe: 'defer',
        deep: false,
    })

    return data.value
}
