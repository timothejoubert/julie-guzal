<script setup lang="ts">
import type { Content } from '@prismicio/client'
import { getSliceComponentProps } from '@prismicio/vue'
import type { FilledContentRelationshipField } from '@prismicio/types'
import { isContentRelationshipField } from '~/utils/prismic/guard'
import type { ProjectPageDocumentData } from '~/prismicio-types'

const props = defineProps(getSliceComponentProps<Content.ProjectFeedSlice>())
const primary = computed(() => props.slice.primary)

const projectDocumentList = computed(() => {
    return primary.value.project.filter((project) => {
        return isContentRelationshipField(project.project_document)
    }).map(project => project.project_document as FilledContentRelationshipField<'project_page', string, ProjectPageDocumentData>)
})

const documentIdList = computed(() => {
    return projectDocumentList.value.map(project => project.id)
})

const allProjects = await usePrismicMainProjects()

const projects = computed(() => {
    return allProjects.value.filter(project => project?.id && documentIdList.value.includes(project.id))
})
</script>

<template>
    <VSlice
        :slice="slice"
        :class="$style.root"
    >
        <ul
            :class="$style.list"
            class="grid"
        >
            <li
                v-for="(project, i) in projects"
                :key="project?.id || i"
                :class="$style.item"
            >
                <VProjectCard
                    :project="project"
                    root-tag="div"
                    :class="$style.project"
                />
            </li>
        </ul>
    </VSlice>
</template>

<style lang="scss" module>
.root {
    margin-top: rem(208);
    margin-bottom: rem(76);

    @include media('>=lg') {
        margin-top: rem(251);
        margin-bottom: rem(120);
    }
}

.list {
    row-gap: rem(54);
    margin-block: initial;

    @include media('>=lg') {
        row-gap: rem(180);
    }
}

.item {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
}

.project {
    grid-column: 1 / -1;
    list-style: none;

    @include media('>=lg') {
        grid-column: span 6;

        .item:nth-child(odd) & {
            grid-column: 7 / -1;
        }

        .item:nth-child(even) & {
            grid-column: 1 / 7;
        }
    }
}
</style>
