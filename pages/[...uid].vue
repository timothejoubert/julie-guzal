<script lang="ts" setup>
import { getDocumentTypeByUrl } from '~/utils/prismic/route-resolver'
import { defaultPageTransition } from '~/transitions/default-page-transition'
import type {
    ContactPageDocument,
    GalleryPageDocument,
    HomePageDocument,
    LabPageDocument,
    ProjectPageDocument,
} from '~/prismicio-types'

definePageMeta({
    pageTransition: defaultPageTransition,
})

const route = useRoute()
const pageType = getDocumentTypeByUrl(route.path)

if (!pageType) {
    throw createError({
        statusCode: 404,
        statusMessage: `can't getDocumentTypeByUrl on ${route.path}`,
    })
}

const { webResponse, error } = await usePrismicFetchPage(pageType)

if (error) {
    showError(error)
}
else if (!webResponse) {
    showError({ status: 404, statusText: 'can\'t find prismic document' })
}

await usePrismicSeoMeta(webResponse)
const alternateLinks = usePrismicHead(webResponse)

const settings = await usePrismicSettingsDocument()

const title = computed(() => {
    const pageTitle = webResponse?.data.meta_title || webResponse?.data.title
    const siteName = settings?.data?.site_name || useRuntimeConfig().public.site.name
    return `${pageTitle} | ${siteName}`
})

usePage({
    title: title.value,
    webResponse,
    alternateLinks,
})

useHead({
    title: title.value,
})

const homeDocument = computed(() => pageType === 'home_page' && webResponse as HomePageDocument)
const contactDocument = computed(() => pageType === 'contact_page' && webResponse as ContactPageDocument)
const projectDocument = computed(() => pageType === 'project_page' && webResponse as ProjectPageDocument)
const labDocument = computed(() => pageType === 'lab_page' && webResponse as LabPageDocument)
const galleryDocument = computed(() => pageType === 'gallery_page' && webResponse as GalleryPageDocument)
</script>

<template>
    <LazyVHomePage
        v-if="homeDocument"
        :document="homeDocument"
    />
    <LazyVContactPage
        v-else-if="contactDocument"
        :document="contactDocument"
    />
    <LazyVProjectPage
        v-else-if="projectDocument"
        :document="projectDocument"
    />
    <LazyVLabPage
        v-else-if="labDocument"
        :document="labDocument"
    />
    <LazyVGalleryPage
        v-else-if="galleryDocument"
        :document="galleryDocument"
    />
</template>
