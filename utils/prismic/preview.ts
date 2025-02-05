import type { RouteLocationNormalizedLoaded } from 'vue-router'

export const previewPath = '/prismic-preview'

export function isPreviewRoute(route: RouteLocationNormalizedLoaded) {
    return route.path === previewPath
}
