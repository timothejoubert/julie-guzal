const DATA_KEY = 'settings-document'

export async function usePrismicSettingsDocument() {
    const nuxtApp = useNuxtApp()

    const { data } = await useAsyncData(DATA_KEY, async () => {
        const prismicClient = usePrismic().client

        return await prismicClient.getSingle('settings')
    }, {
        getCachedData: key => nuxtApp.static.data[key] ?? nuxtApp.payload.data[key], // no re-fetch data if the key is already in the payload
        dedupe: 'defer', // wait for the first request to finish before making another request
    })

    return data.value
}
