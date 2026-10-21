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

// Throw (not showError) so rendering stops here: otherwise the page keeps rendering with no document
// and an unknown project URL answers an empty page with HTTP 200 instead of the 404 error page.
if (error) {
    throw createError({ ...error, fatal: true })
}
else if (!webResponse?.id) { // the fetch resolves to `{ data: '' }` when Prismic has no document
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { title } = await usePrismicSeoMeta(webResponse)
usePrismicHead(webResponse)

usePage({
    title,
    webResponse,
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
