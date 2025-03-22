import { getDocumentTypeByUrl } from '~/utils/prismic/route-resolver'

export default defineNuxtRouteMiddleware(async (to, from) => {
    const { name: transitionName, pageDirection } = usePageTransitionState()

    const fromDocument = getDocumentTypeByUrl(from.path)
    const toDocument = getDocumentTypeByUrl(to.path)

    if (!to.meta.pageTransition) return
    else if (fromDocument === toDocument) transitionName.value = 'first-reveal'
    else if (toDocument === 'gallery_page') {
        transitionName.value = 'slide-left'
    }
    else if ((fromDocument === 'project_page' && toDocument === 'home_page') || fromDocument === 'gallery_page') {
        transitionName.value = 'slide-right'
    }
    else if (fromDocument === 'home_page' && toDocument === 'project_page') {
        transitionName.value = 'home-card-to-project'
    }
    else {
        transitionName.value = 'default'
    }

    // Set page direction
    const menu = await usePrismicMenuDocument()
    const menuItems = menu.value?.data.links
    const fromIndex = menuItems?.findIndex((item) => {
        return (item.internal_page as { url?: string })?.url === from.path || item.external_url === from.fullPath
    }) || -1
    const toIndex = menuItems?.findIndex((item) => {
        return (item.internal_page as { url?: string })?.url === to.path || item.external_url === to.fullPath
    }) || -1

    pageDirection.value = fromIndex > toIndex ? 'backwards' : 'forwards'
    console.log('indexes', pageDirection.value)
})
