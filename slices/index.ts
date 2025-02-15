// Code generated by Slice Machine. DO NOT EDIT.

import { defineAsyncComponent } from 'vue'
import { defineSliceZoneComponents } from '@prismicio/vue'

export const components = defineSliceZoneComponents({
    cross_nav: defineAsyncComponent(() => import('./CrossNav/index.vue')),
    gallery_grid: defineAsyncComponent(() => import('./GalleryGrid/index.vue')),
    masonry_medias: defineAsyncComponent(
        () => import('./MasonryMedias/index.vue'),
    ),
    media: defineAsyncComponent(() => import('./Media/index.vue')),
    project_feed: defineAsyncComponent(() => import('./ProjectFeed/index.vue')),
    simple_content: defineAsyncComponent(
        () => import('./SimpleContent/index.vue'),
    ),
})
