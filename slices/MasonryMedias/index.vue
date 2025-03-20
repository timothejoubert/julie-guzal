<script setup lang="ts">
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import type { MasonryMediasSlice } from '~/prismicio-types'
import { getHtmlElement, type TemplateElement } from '~/utils/ref/get-html-element'

type StoredImage = { el: null | HTMLElement, top: null | number, index: number }

const props = defineProps(getSliceComponentProps<MasonryMediasSlice>())
const primary = computed(() => props.slice.primary)

const mediaInstances = useTemplateRefsList<TemplateElement>()
const imageElementList = computed(() => {
    return mediaInstances.value.map((instance) => {
        return getHtmlElement(instance) as HTMLElement
    }).filter(el => !!el)
})
const lastTopColumnedElement = computed(() => {
    return imageElementList.value.reduce((acc, el, index) => {
        const top = el?.getBoundingClientRect?.().top

        if (!acc.el || (top && acc?.top && top <= acc?.top)) acc = { el, top, index } as StoredImage
        return acc
    }, { el: null, top: null, index: -1 } as StoredImage)
})

const lastTopColumnedElementIndex = computed(() => lastTopColumnedElement.value.index || 0)
watch(lastTopColumnedElementIndex, (value) => {
    if (value) initTweens()
})
// TWEENS
const rootElement = useTemplateElement('rootElement')
const { $gsap } = useNuxtApp()
let tweenList: GSAPTween[] = []

function resetTweens() {
    if (!tweenList.length) return
    tweenList.forEach(tween => tween?.scrollTrigger?.refresh())
}

function initTweens() {
    if (!imageElementList.value?.length) {
        return
    }

    if (tweenList.length) {
        resetTweens()
        return
    }

    killTweens()
    imageElementList.value
        .forEach((el, index) => {
            const tween = $gsap.to(el, {
                scrollTrigger: {
                    trigger: rootElement.value || el,
                    scrub: true,
                    start: 'top',
                    end: 'bottom',
                    // markers: true,
                },
                y: ScrollTrigger.maxScroll(window) * (index < lastTopColumnedElementIndex.value ? 0.01 : -0.02),
                ease: 'none',
            })

            tweenList.push(tween)
        })
}

function killTweens() {
    if (!tweenList?.length) return

    tweenList.forEach(tween => tween?.kill())
    tweenList = []
}

const isLargeScreen = useMediaQuery('(min-width: 1024px)', { ssrWidth: 1023 })
watch(isLargeScreen, (value) => {
    if (value) initTweens()
    else killTweens()
})

onBeforeUnmount(killTweens)

// Reveal
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
        class="element-translate element-translate--05-delay"
        :class="[$style.root, reveal && 'element-translate--reveal']"
    >
        <template v-if="primary.list.length">
            <VPrismicMedia
                v-for="(field, index) in primary.list"
                :key="index"
                ref="mediaInstances"
                :class="[$style.image, index === lastTopColumnedElementIndex && $style['image--offset-top']]"
                :document="field.image?.url ? field.image : field.embed"
                :image="{ sizes: 'xs:100vw md:100vw lg:50vw xl:50vw xxl:50vw hq:50vw qhd:50vw' }"
                :video="{
                    autoplay: field.video_autoplay,
                    controls: !field.video_autoplay,
                }"
            />
        </template>
    </VSlice>
</template>

<style lang="scss" module>
.root {
    position: relative;
    z-index: 1;
    background-color: var(--theme-color-background);
    column-count: 1;
    padding-block: rem(242) rem(120);
    padding-inline: var(--gutter);

    @include media('>=lg') {
        column-count: 2;
        column-gap: rem(24);
        padding-block: rem(235) rem(180);
    }
}

.image {
    margin-bottom: rem(10);
    grid: 1 / -1;

    @include media('>=lg') {
        margin-bottom: rem(24);
        transition: padding-top 0.4s ease(out-quad);

        &--offset-top {
            padding-top: rem(316);
        }
    }
}
</style>
