<script  lang="ts" setup>
import type { ProjectPageDocument } from '~/prismicio-types'

const props = defineProps<{
    current: ProjectPageDocument
}>()

const projects = await usePrismicMainProjects()

const nextProjectIndex = computed(() => {
    const currentIndex = projects.value.findIndex(project => project.id === props.current.id)
    const getFirstIndex = currentIndex === -1 || currentIndex === projects.value.length - 1
    return getFirstIndex ? 0 : currentIndex + 1
})

const nextProject = computed(() => {
    return projects.value[nextProjectIndex.value]
})
</script>

<template>
    <section
        :class="$style.root"
        class="grid"
    >
        <h1 :class="$style.title">
            {{ $t('more') }}
        </h1>
        <ul
            v-if="projects.length"
            :class="$style.list"
        >
            <li
                v-for="project in projects"
                :key="project.id"
                :class="$style.item"
            >
                <VPrismicLink
                    :to="project"
                    :class="$style.link"
                    :label="project.data.title"
                />
            </li>
        </ul>
        <VPrismicLink
            :to="nextProject"
            :class="$style.next"
        >
            <div :class="$style.next__title">
                {{ nextProject.data.title }}
                <VIcon
                    :class="$style.arrow"
                    name="arrow-right-bottom"
                    width="20"
                    height="20"
                />
            </div>
            <VPrismicImage
                v-if="nextProject.data.image"
                :document="nextProject.data.image"
                fit="crop"
                ar="708:360"
                width="708"
                height="360"
                :class="$style.next__image"
                sizes="xs:100vw md:100vw lg:50vw xl:50vw xxl:50vw qhd:50vw"
            />
        </VPrismicLink>
    </section>
</template>

<style lang="scss" module>
@use 'assets/scss/variables/fonts' as *;
@use 'assets/scss/functions/rem' as *;
@use 'assets/scss/mixins/include-media' as *;

.root {
    position: relative;

    &::before {
        position: absolute;
        content: '';
        top: 0;
        left: calc(var(--gutter) * -1);
        right: calc(var(--gutter) * -1);
        background-color: var(--theme-color-on-background);
        height: 1px;
    }
}

.title {
    margin-block: rem(46) 0;
    grid-column: 1 / -1;
    font-family: $font-lecturis-family;
    line-height: 1;
    font-size: rem(100);
    font-weight: 300;
    text-transform: uppercase;

    @include media('>=lg') {
        margin-top: rem(32);
        grid-column: 1 / 7;
    }
}

.list {
    display: flex;
    flex-wrap: wrap;
    margin-top: rem(120);
    grid-column: 1 / -1;

    @include media('>=lg') {
        grid-column: 1 / 7;
        margin-top: initial;
        align-self: end;
    }
}

.item {
    list-style: none;
}

.link {
    font-family: $font-lecturis-family;
    line-height: 1.3;
    font-size: rem(24);
    font-weight: 300;
    text-decoration: none;
    color: var(--theme-color-on-background);
    white-space: break-spaces;
    transition: opacity 0.3s, color 0.3s;

    @media (hover: hover) {
        .list:has(&:hover) & {
            opacity: 0.7;
        }

        &:hover {
            color: var(--theme-color-primary);
            opacity: 1 !important;
        }
    }
    &:after {
        position: relative;
        content: ', ';
    }

    .item:last-child &:after {
        content: '.';
    }
}

.next {
    margin-top: rem(80);
    grid-column: 1 / -1;
    text-decoration: none;

    @include media('>=lg') {
        grid-column: 7 / -1;
        margin-top: initial;
    }
}

.next__title {
    font-family: $font-lecturis-family;
    line-height: 1.3;
    font-size: rem(40);
    font-weight: 300;
    color: var(--theme-color-on-background);
}

.next__image {
    --v-img-max-width: none;

    width: calc(100% + var(--gutter) * 2);
    margin-left: calc(var(--gutter) * -1);
    margin-top: rem(24);

    @include media('>=lg') {
        width: 100%;
        margin-left: initial;
    }
}

.arrow {
    height: auto;
    opacity: 0;
    translate: rem(10) rem(10);
    transform-origin: right bottom;
    rotate: 20deg;
    transition-property: opacity, translate, rotate;
    transition-duration: 0.2s;
    transition-timing-function: ease(out-quad);

    @media (hover: hover) {
        .next:hover & {
            translate: 0 0;
            rotate: 0deg;
            opacity: 1;
        }
    }
}
</style>
