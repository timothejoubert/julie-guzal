<script setup lang="ts">
import type { Content } from '@prismicio/client'
import { getSliceComponentProps } from '@prismicio/vue'
import type { FilledContentRelationshipField } from '@prismicio/types'
import { isContentRelationshipField } from '~/utils/prismic/guard'
import type { ProjectPageDocument, ProjectPageDocumentData } from '~/prismicio-types'

const props = defineProps(getSliceComponentProps<Content.ProjectFeedSlice>())
const primary = computed(() => props.slice.primary)

const projectDocumentList = computed(() => {
    return primary.value.project.filter((project) => {
        return isContentRelationshipField(project.project_document)
    }).map(project => project.project_document as FilledContentRelationshipField<'project_page', string, ProjectPageDocumentData>)
})

const hasManualProjects = computed(() => {
    return props.slice.variation === 'manualChoice' && !!projectDocumentList.value.length
})

const allProjects = await usePrismicMainProjects()

const projects = computed(() => {
    if (!hasManualProjects.value) return allProjects.value

    // Keep same order as contentRelationField
    return projectDocumentList.value.reduce((acc: ProjectPageDocument[], project) => {
        const sameFilledProject = allProjects.value.find(p => p?.id === project.id)
        if (sameFilledProject) acc.push(sameFilledProject)
        return acc
    }, [])
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
    position: relative;
    padding-top: rem(208);
    padding-bottom: rem(76);
    z-index: 1;
    background-color: var(--theme-color-background);

    @include media('>=lg') {
        padding-top: rem(251);
        padding-bottom: rem(120);
    }
}

.list {
    margin-block: initial;
    row-gap: rem(54);

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
