import { usePageTransitionState } from '~/composables/use-page-transition-state'

function getActiveLink(el: Element) {
    return el.querySelector('a.router-link-exact-active') || el.querySelector('a[aria-current="page"]')
}

export function useActiveProjectCardElement(el: Element) {
    const { name } = usePageTransitionState()
    const activeLink = getActiveLink(el) as HTMLElement | null
    const route = useRoute()

    function formattedId(uid: string | null | undefined) {
        return uid?.replaceAll('/', '-') || 'project-card'
    }

    const isActiveProjectCard = name.value === 'home-card-to-project' && activeLink?.getAttribute('href') === route.path
    const cardElement = isActiveProjectCard && activeLink ? activeLink.parentNode as HTMLElement : undefined
    const id = formattedId(activeLink?.getAttribute('href'))

    return { cardElement, id }
}
