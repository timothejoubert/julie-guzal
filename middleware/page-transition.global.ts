import type { RouteLocationNormalized } from 'vue-router'
import { DATA_KEY as MENU_DATA_KEY } from '~/composables/use-prismic-menu-document'
import type { MenuDocument } from '~/prismicio-types'

type MenuItems = MenuDocument['data']['links'] | undefined

function getMenuIndex(menuItems: MenuItems, route: RouteLocationNormalized) {
    return menuItems?.findIndex((item) => {
        return (item.internal_page as { url?: string })?.url === route.path || item.external_url === route.fullPath
    }) ?? -1
}

export default defineNuxtRouteMiddleware(async (to, from) => {
    const { pageDirection } = usePageTransitionState()

    // Set page direction from the menu order.
    // The menu is already loaded by the navigation (VNav): read it from the cache instead of awaiting a request.
    const cachedMenu = useNuxtData<MenuDocument>(MENU_DATA_KEY).data.value
    const menu = cachedMenu ?? (await usePrismicMenuDocument()).value
    const menuItems = menu?.data.links

    const fromIndex = getMenuIndex(menuItems, from)
    const toIndex = getMenuIndex(menuItems, to)

    // Pages outside the menu (e.g. projects) always use the forwards transition
    const isBackwards = fromIndex !== -1 && toIndex !== -1 && fromIndex > toIndex
    pageDirection.value = isBackwards ? 'backwards' : 'forwards'
})
