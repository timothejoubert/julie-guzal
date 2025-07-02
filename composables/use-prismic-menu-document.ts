export const DATA_KEY = 'menu-document'

export async function usePrismicMenuDocument() {
    const prismicClient = usePrismic().client

    const { data } = await useAsyncData(DATA_KEY, () => prismicClient.getSingle('menu'))
    return data
}
