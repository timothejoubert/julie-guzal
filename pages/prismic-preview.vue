<script  lang="ts" setup>
import type {
    ContactPageDocument,
    GalleryPageDocument,
    HomePageDocument,
    LabPageDocument,
    ProjectPageDocument,
} from '~/prismicio-types'

const currentPage = useCurrentPage()
// /prismic-preview?token=https://julie-guzal.prismic.io/previews/Z6OzehEAACoACzli:Z6OzhxEAACoACzl4?websitePreviewId%3DZ6FQNhEAACwAB0Gl&documentId=Z5vznhEAAC0A_xZN

const webResponse = computed(() => currentPage.value.webResponse)
const homeDocument = computed(() => webResponse.value?.type === 'home_page' && webResponse.value as HomePageDocument)
const contactDocument = computed(() => webResponse.value?.type === 'contact_page' && webResponse.value as ContactPageDocument)
const projectDocument = computed(() => webResponse.value?.type === 'project_page' && webResponse.value as ProjectPageDocument)
const labDocument = computed(() => webResponse.value?.type === 'lab_page' && webResponse.value as LabPageDocument)
const galleryDocument = computed(() => webResponse.value?.type === 'gallery_page' && webResponse.value as GalleryPageDocument)
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
