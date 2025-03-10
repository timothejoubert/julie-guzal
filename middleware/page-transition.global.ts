import { getDocumentTypeByUrl } from '~/utils/prismic/route-resolver'

export default defineNuxtRouteMiddleware((to, from) => {
    const { name: transitionName } = usePageTransitionState()

    const fromDocument = getDocumentTypeByUrl(from.path)
    const toDocument = getDocumentTypeByUrl(to.path)

    if (fromDocument === toDocument) transitionName.value = 'first-reveal'
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

    console.log('defineNuxtRouteMiddleware transition name:', fromDocument, toDocument, transitionName.value)
})
