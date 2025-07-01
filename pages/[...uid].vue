<script lang="ts" setup>
import { getDocumentTypeByUrl } from '~/utils/prismic/route-resolver'
import { cardPageTransition } from '~/transitions/card-transition'
import type { ReachableDocument } from '~/types/api'
import type {
    ContactPageDocument,
    GalleryPageDocument,
    HomePageDocument,
    LabPageDocument,
    ProjectPageDocument,
} from '~/prismicio-types'

definePageMeta({
    pageTransition: cardPageTransition, // defaultPageTransition,
})

const route = useRoute()
const pageType = getDocumentTypeByUrl(route.path)

if (!pageType) {
    throw createError({
        statusCode: 404,
        statusMessage: `can't getDocumentTypeByUrl on ${route.path}`,
    })
}

const { webResponse, error } = await usePrismicFetchPage<ReachableDocument>(pageType)

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
    if (webResponse?.data.meta_title) return webResponse?.data.meta_title
    const siteName = settings?.data?.site_name || useRuntimeConfig().public.site.name
    return `${webResponse?.data.title} | ${siteName}`
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

const $style = useCssModule()
const theme = computed(() => {
    if (contactDocument.value || galleryDocument.value) return 'light'
    else return 'dark'
})

const rootClasses = computed(() => {
    return [$style.root, theme.value && $style[`root--theme-${theme.value}`]]
})
</script>

<template>
    <div :class="rootClasses">
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
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/mixins/theme' as *;

.root {
    background-color: var(--theme-color-background);
    color: var(--theme-color-on-background);

    @include theme-variants;
}
</style>
