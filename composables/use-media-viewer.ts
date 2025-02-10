import type { PossibleMedia } from '~/composables/use-prismic-media'

export function useMediaViewer() {
    const documents = useState<PossibleMedia[] | null>('mediaViewerDocuments', () => null)
    const isOpen = computed(() => !!documents.value)

    const index = useState<number>('mediaViewerIndex', () => 0)

    const open = (medias: PossibleMedia[], index?: number) => {
        documents.value = medias
        updateIndex(index || 0)
    }
    const close = () => {
        documents.value = null
        index.value = 0
    }

    const updateIndex = (value: number) => (index.value = value)
    const previousSlide = () => updateIndex(Math.max(index.value - 1, 0))
    const nextSlide = () => updateIndex(Math.min(index.value + 1, (documents.value?.length || 1) - 1))

    return { documents, index, isOpen, open, close, nextSlide, previousSlide }
}
