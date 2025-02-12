<script  lang="ts" setup>
import type { HomePageDocument } from '~/prismicio-types'
import { components } from '~/slices'

const props = defineProps<{
    document: HomePageDocument
}>()

const projects = await usePrismicMainProjects()

const slices = computed(() => props.document.data.slices)
</script>

<template>
    <div>
        <VTopBar :class="$style['top-bar']" />
        <main>
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
            <LazySliceZone
                v-if="slices?.length"
                :slices="slices"
                :components="components"
            />
        </main>
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/mixins/theme' as *;
@use 'assets/scss/mixins/include-media' as *;

.top-bar {
    & :global(.v-nav) {
        @include theme('light')
    }

    @include media('>=md') {
        & :global(.v-nav) {
            @include theme('dark')
        }
    }
}

.list {
    margin-top: rem(208);
    margin-bottom: rem(76);
    row-gap: rem(54);

    @include media('>=lg') {
        margin-top: rem(251);
        margin-bottom: rem(120);
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
