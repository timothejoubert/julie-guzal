<script  lang="ts" setup>
import type {
    ContactPageDocument,
    GalleryPageDocument,
    HomePageDocument,
    LabPageDocument,
    ProjectPageDocument,
} from '~/prismicio-types'

// /prismic-preview?token=https://julie-guzal.prismic.io/previews/Z6OzehEAACoACzli:Z6OzhxEAACoACzl4?websitePreviewId%3DZ6FQNhEAACwAB0Gl&documentId=Z5vznhEAAC0A_xZN
const { isPreview } = usePrismicPreviewRoute()
console.log('preview page', isPreview.value);

const { webResponse } = await usePrismicFetchPage('preview')

const homeDocument = computed(() => webResponse?.type === 'home_page' && webResponse as HomePageDocument)
const contactDocument = computed(() => webResponse?.type === 'contact_page' && webResponse as ContactPageDocument)
const projectDocument = computed(() => webResponse?.type === 'project_page' && webResponse as ProjectPageDocument)
const labDocument = computed(() => webResponse?.type === 'lab_page' && webResponse as LabPageDocument)
const galleryDocument = computed(() => webResponse?.type === 'gallery_page' && webResponse as GalleryPageDocument)
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
