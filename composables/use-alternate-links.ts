import type { AlternateLanguage } from '@prismicio/types'

export function useAlternateLinks(links?: AlternateLanguage[]) {
    const alternateLinks = useState<AlternateLanguage[]>('alternateLinks', () => [])

    if (links) alternateLinks.value = links

    return { alternateLinks }
}
