<script  lang="ts" setup>
import type { PossibleProjectPageDocument } from '~/types/app'

interface VProjectCardProps {
    project: PossibleProjectPageDocument | null
    skeleton?: boolean
    rootTag?: string
    // Above-the-fold card (e.g. first card of the home feed): load its image eagerly with a high fetch priority (LCP)
    priority?: boolean
}

const props = defineProps<VProjectCardProps>()

const { image, title, date, tags } = useProjectUtils(props.project)

// Preload the project page hero on hover/focus, so the page transition (which waits for the hero to be
// decoded) can start right away on click. The hidden picture renders the same sources as the page.
const preloadHero = ref(false)
function onIntent() {
    preloadHero.value = true
}
</script>

<template>
    <component
        :is="rootTag || 'div'"
        :id="project?.url?.replaceAll('/', '-')"
        :class="[$style.root, skeleton && $style['root--skeleton']]"
        @pointerenter.once="onIntent"
        @focusin.once="onIntent"
    >
        <VProjectHeroPicture
            v-if="preloadHero && image"
            :image="image"
            :class="$style['hero-preload']"
            aria-hidden="true"
        />
        <VPrismicLink
            :to="project"
            :class="$style['media-wrapper']"
            tabindex="-1"
        >
            <VPrismicImage
                v-if="image"
                :document="image"
                fit="crop"
                ar="684:414"
                width="684"
                height="414"
                :alt="image.alt || $t('v_project_card.alt', { projectName: title })"
                :class="$style.image"
                :loading="priority ? 'eager' : 'lazy'"
                :fetchpriority="priority ? 'high' : undefined"
                sizes="xs:100vw sm:100vw md:100vw lg:50vw xl:50vw hd:50vw qhd:50vw"
            />
            <div
                v-else
                :class="[$style.image, $style['image--placeholder']]"
            />
        </VPrismicLink>
        <VPrismicLink
            :to="project"
            :class="$style.title"
        >
            {{ title }}
        </VPrismicLink>
        <div
            v-if="tags.length"
            :class="$style.tags"
        >
            <VTag
                v-for="tag in tags"
                :key="tag"
                :class="$style.tag"
                :label="tag"
            />
        </div>
        <VTime
            v-if="date"
            :date="date"
            :class="$style.date"
        />
    </component>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;
@use 'assets/scss/functions/fluid' as *;
@use 'assets/scss/variables/fonts' as *;
@use 'assets/scss/mixins/include-media' as *;

// Off-screen copy of the project page hero: loaded, never visible. Full viewport width so `sizes` in vw resolve like on the page.
.hero-preload {
    position: fixed;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100vw;
    pointer-events: none;
    visibility: hidden;
}

.root {
    position: relative;
    display: flex;
    flex-wrap: wrap;
}

.media-wrapper {
    display: block;
    overflow: hidden;
    width: 100%;
}

.image {
    width: 100%;
    scale: 1.03;
    transition: scale 0.4s ease(out-quad);

    &--placeholder {
        aspect-ratio: 460 / 248;
        background-color: lightgrey;
    }

    @media (hover: hover) {
        .root:hover & {
            scale: 1;
        }
    }
}

.title {
    display: block;
    width: 100%;
    color: inherit;
    font-family: $font-lecturis-family;
    font-size: fluid((xs: 24, xl: 30));
    font-weight: 300;
    line-height: 1.4;
    margin-block: rem(14) rem(25);
    text-decoration: none;

    @include media('>=lg') {
      margin-block: rem(48) rem(60);
    }
}

.tags {
  width: 50%;
  font-family: $font-suisse-family;
  font-size: rem(14);
  font-weight: 300;
  line-height: 1.3;
}

.date {
  width: 50%;
    margin-left: auto;
  font-family: $font-suisse-family;
  font-size: rem(14);
  font-weight: 300;
  line-height: 1.3;
  text-align: right;
}
</style>
