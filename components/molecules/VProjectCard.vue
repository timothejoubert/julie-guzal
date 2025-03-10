<script  lang="ts" setup>
import type { PossibleProjectPageDocument } from '~/types/app'
import type { PageTransitionEventData } from '~/transitions/default-page-transition'
import EventType from '~/constants/event-type'
// import { useProjectNextPageHeaderImg } from '~/composables/use-project-next-page-header-img'

interface VProjectCardProps {
    project: PossibleProjectPageDocument | null
    skeleton?: boolean
    rootTag?: string
}

const props = defineProps<VProjectCardProps>()

const { image, title, date, tags } = useProjectUtils(props.project)

// const { $gsap } = useNuxtApp()
// function onPageLeave({ pageEl, linkClicked, done }: PageTransitionEventData) {
//     const isActiveLink = url.value === (linkClicked?.getAttribute('href') || document.querySelector('a[aria-current="page"]'))
//     console.log('VProjectCard onPageLeave', isActiveLink, linkClicked)
//
//     if (!isActiveLink || !linkClicked) return
//
//     console.log('VProjectCard onPageLeave', linkClicked, isActiveLink)
//
//     window.addEventListener('scrollend', () => {
//         console.log('on Scroll end')
//         done()
//     }, { once: true })
//
//     linkClicked.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
// }
//
// function onPageEnter({ pageEl, linkClicked, done }: PageTransitionEventData) {
//     console.log('onPageEnter', pageEl, linkClicked)
//
//     window.setTimeout(() => {
//         console.log('onPageEnter done')
//         done()
//     }, 1000)
// }

// const { elementFlipState } = useProjectNextPageHeaderImg()
// watch(elementFlipState, () => {
//
// })

// usePageTransitionEvent(EventType.PAGE_TRANSITION_LEAVE, onPageLeave)
// usePageTransitionEvent(EventType.PAGE_TRANSITION_ENTER, onPageEnter)
</script>

<template>
    <component
        :is="rootTag || 'div'"
        :id="project?.url?.replaceAll('/', '-')"
        :class="[$style.root, skeleton && $style['root--skeleton']]"
    >
        <VPrismicLink
            :to="project"
            :class="$style['media-wrapper']"
            rel="noopener nofollow"
            tabindex="-1"
        >
            <VPrismicImage
                v-if="image"
                :document="image"
                fit="crop"
                ar="684:414"
                width="684"
                height="414"
                :class="$style.image"
                sizes="xs:100vw sm:100vw md:100vw lg:50vw xl:50vw xxl:50vw hq:50vw qhd:50vw"
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

.root {
    position: relative;
    display: flex;
    flex-wrap: wrap;
}

.media-wrapper {
    display: block;
    width: 100%;
}

.image {
    width: 100%;

    &--placeholder {
        aspect-ratio: 460 / 248;
        background-color: lightgrey;
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
