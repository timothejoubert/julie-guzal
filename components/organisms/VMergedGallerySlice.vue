<script setup lang="ts">
import type { GalleryGridSlice } from '~/prismicio-types'

const props = defineProps<{
    slices: GalleryGridSlice[]
}>()

const slicesItems = computed(() => {
    return props.slices.map((gallerySlice) => {
        return gallerySlice.primary.item
    }).flat()
})

const imageList = computed(() => {
    return slicesItems.value?.filter((groupField) => {
        return groupField.image?.url
    }).map((groupField, index) => {
        const forceLandscapeRatio = index % 9 === 0 || index % 9 === 1
        return {
            document: {
                ...groupField.image,
                copyright: groupField.image?.alt || groupField.description,
            },
            fit: 'crop',
            ar: forceLandscapeRatio ? '566:342' : '330:432',
            sizes: forceLandscapeRatio ? 'xs:95vw sm:95vw md:40vw lg:40vw xl:40vw qhd:40vw' : 'xs:95vw sm:95vw md:25vw lg:25vw xl:25vw qhd:25vw',
            // crop: 'top,left',
        }
    })
})

const { documents, index: mediaViewerIndex } = useMediaViewer()

const mediaViewerDocument = computed(() => {
    return imageList.value.map(media => (media.document))
})

function onClick(index: number) {
    documents.value = mediaViewerDocument.value
    mediaViewerIndex.value = index
}

// TWEENS
const { $gsap } = useNuxtApp()
let tweenList: GSAPTween[] = []
const elementList = useTemplateRefsList<HTMLDivElement>()

function resetTweens() {
    if (!tweenList.length) return
    tweenList.forEach(tween => tween?.scrollTrigger?.refresh())
}

function initTweens() {
    if (!elementList.value?.length) {
        return
    }

    if (tweenList.length) {
        resetTweens()
        return
    }

    tweenList = []
    elementList.value.forEach((el, index) => {
        const tween = $gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                scrub: true,
                start: 'clamp(top center)',
                end: 'bottom top',
                // markers: true,
            },
            yPercent: (index % 2) ? 20 : -20,
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

const isLargeScreen = useMediaQuery('(min-width: 768px)', { ssrWidth: 767 })
watch(isLargeScreen, (value) => {
    if (value) initTweens()
    else killTweens()
})

onBeforeUnmount(killTweens)
</script>

<template>
    <section
        class="grid"
        data-slice-type="gallery_grid"
        data-slice-variation="default"
        :class="$style.root"
    >
        <template v-if="imageList.length">
            <button
                v-for="(media, index) in imageList"
                :key="index"
                :ref="elementList.set"
                :class="$style.item"
                :aria-label="$t('media_viewer.open')"
                @click="onClick(index)"
            >
                <VPrismicImage
                    v-bind="media"
                    :class="$style.img"
                />
            </button>
        </template>
    </section>
</template>

<style lang="scss" module>
.root {
    --gallery-grid-slice-row-gap: #{rem(10)};
    --gallery-grid-slice-margin-top: #{rem(202)};
    --gallery-grid-slice-margin-bottom: #{rem(120)};

    position: relative;
    z-index: 1;
    margin-block: var(--gallery-grid-slice-margin-top) var(--gallery-grid-slice-margin-bottom);
    row-gap: var(--gallery-grid-slice-row-gap);

    &::before {
        content: '';
        position: absolute;
        inset: 0 calc(var(--gutter) * -1);
        background-color: var(--theme-color-background);
    }

    @include media('>=md') {
        --gallery-grid-slice-row-gap: #{rem(24)};
        --gallery-grid-slice-margin-top: #{rem(48)};
        --gallery-grid-slice-margin-bottom: #{rem(80)};
    }

    @include media('>=lg') {
        --gallery-grid-slice-margin-top: #{rem(235)};
        --gallery-grid-slice-margin-bottom: #{rem(180)};
    }
}

.item {
    overflow: hidden;
    padding: initial;
    border: initial;
    background: initial;
    grid-column: 1 / -1;

    @include media('>=md') {
        &:nth-child(9n + 1) {
            grid-column: 8 / -1;
        }

        &:nth-child(9n + 2) {
            display: grid;
            grid-column: 1 / -1;
            grid-template-columns: subgrid;

            & > * {
                grid-column: 1 / span 5;
            }
        }

        &:nth-child(9n + 3) {
            grid-column: 7 / span 3;
        }

        &:nth-child(9n + 4) {
            grid-column: 1 / span 3;
        }

        &:nth-child(9n + 5) {
            grid-column: 10 / -1;
        }

        &:nth-child(9n + 6) {
            grid-column: 4 / span 3;
        }

        &:nth-child(9n + 7) {
            grid-column: 7 / span 3;
        }

        &:nth-child(9n + 8) {
            display: grid;
            grid-column: 1 / -1;
            grid-template-columns: subgrid;

            & > * {
                grid-column: 10 / -1;
            }
        }

        &:nth-child(9n + 9) {
            display: grid;
            grid-column: 1 / -1;
            grid-template-columns: subgrid;

            & > * {
                grid-column: 1 / span 3;
            }
        }
    }
}

.img {
    width: 100%;
    cursor: pointer;
}
</style>
