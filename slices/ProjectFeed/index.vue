<script setup lang="ts">
import type { Content } from '@prismicio/client'
import { getSliceComponentProps } from '@prismicio/vue'
import type { FilledContentRelationshipField } from '@prismicio/types'
import { isContentRelationshipField } from '~/utils/prismic/guard'
import type { ProjectPageDocument, ProjectPageDocumentData } from '~/prismicio-types'
import { useWebsiteReveal } from '~/composables/use-website-reveal'

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

// Reveal
const rootElement = useTemplateElement('rootElement')
const rootElementIsVisible = useElementVisibility(rootElement)
const { firstReveal } = useWebsiteReveal()
const reveal = computed(() => {
    if (!firstReveal.value) return

    return rootElementIsVisible.value
})
</script>

<template>
    <VSlice
        ref="rootElement"
        :slice="slice"
        class="element-translate"
        :class="[$style.root, reveal && 'element-translate--reveal']"
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
    z-index: 1;
    padding-top: rem(208 - 24 - 16);
    padding-bottom: rem(76);
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
