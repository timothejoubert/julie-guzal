<script lang="ts" setup>
import type Plyr from 'plyr'
import VDraggableScroll from '~/components/organisms/VDraggableScroll/VDraggableScroll.vue'

const id = useId()

const { documents, index: slideIndex, close, nextSlide, previousSlide } = useMediaViewer()

useEventListener('keyup', onKeyPressed)

function onKeyPressed(event: KeyboardEvent) {
    if (event.key === 'Escape') close()
    else if (event.key === 'ArrowLeft') previousSlide()
    else if (event.key === 'ArrowRight') nextSlide()
}

const plyrInstances = ref<{ index: number, plyr: Plyr }[]>([])
watch(
    slideIndex,
    (currentSlideIndex) => {
        const inertVideos = plyrInstances.value.find((item) => {
            return item.index !== currentSlideIndex && !item.plyr.paused
        })

        if (inertVideos) inertVideos.plyr?.pause()
    },
    { flush: 'post' },
)

const root = ref<HTMLDialogElement | null>(null)

onMounted(() => {
    root.value?.showModal()
})

onBeforeUnmount(() => {
    root.value?.close()
})

const $style = useCssModule()
const rootClasses = computed(() => {
    return [$style.root]
})
</script>

<template>
    <dialog
        :id="id"
        ref="root"
        :class="rootClasses"
    >
        <div
            :class="$style.wrapper"
        >
            <button
                :class="$style.close"
                :aria-label="$t('media_viewer.close')"
                @click="close"
            >
                {{ $t('close') }}
            </button>
            <div :class="$style.controls">
                <button
                    :class="[$style.control, $style['control--prev']]"
                    :aria-label="$t('carousel.prev')"
                    @click="previousSlide"
                >
                    <VIcon name="arrow-left" />
                </button>
                <button
                    :class="[$style.control, $style['control--next']]"
                    :aria-label="$t('carousel.next')"
                    @click="nextSlide"
                >
                    <VIcon name="arrow-right" />
                </button>
            </div>
            <VDraggableScroll
                v-model="slideIndex"
                :class="$style.medias"
            >
                <div
                    v-for="(document, index) in documents"
                    :key="index"
                    :class="$style.slide"
                >
                    <VPrismicMedia
                        :document="document"
                        :class="$style.image"
                    />
                    <div>{{ slideIndex }}</div>
                    <VText
                        v-if="document?.copyright"
                        :content="document.copyright"
                        :class="$style.figcaption"
                    />
                </div>
            </VDraggableScroll>
        </div>
    </dialog>
</template>

<style lang="scss" module>
@use 'assets/scss/mixins/include-media' as *;
@use 'assets/scss/mixins/theme' as *;
@use 'assets/scss/variables/fonts' as *;
@use 'assets/scss/functions/rem' as *;
@use 'assets/scss/functions/flex-grid' as *;

.root {
    position: fixed;
    z-index: 101;
    width: 100%;
    max-width: initial;
    height: 100%;
    max-height: initial;
    align-items: center;
    justify-content: center;
    padding: initial;
    border: initial;
    margin: initial;
    inset: 0;
    overflow: hidden;

    color: var(--theme-color-on-background);
    background-color: var(--theme-color-background);

    @include theme('light');
}

.wrapper {
    padding-block: rem(24);
    height: 100%;
}

.close {
    position: absolute;
    z-index: 2;
    top: rem(16);
    right: var(--gutter);
    display: flex;
    align-items: center;
    justify-content: center;
    border: initial;
    background-color: initial;
    cursor: pointer;

    @include media('>=lg') {
        top: rem(24);
        right: rem(24);
    }
}

.controls {
    position: fixed;
    bottom: rem(24);
    right: rem(24);
}

.control {
    display: flex;
    align-items: center;
    justify-content: center;
    border: initial;
    background-color: initial;
    cursor: pointer;
}

.medias {
    width: 100%;
    height: 100%;

    display: flex;
    align-items: flex-end;
}

.slide {
    display: flex;
    align-items: flex-end;
    padding-inline: var(--gutter);
    column-gap: var(--gutter);
    width: 100%;
    flex-shrink: 0;
}

.image {
    width: flex-grid(5, 12);
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
    //width: calc(#{flex-grid-value(5, 12, '%', true)});

    @include media('>=lg') {
    }
}

.figcaption {
    font-family: $font-suisse-family;
    font-size: rem(14);
    line-height: 1.42;
    font-weight: 400;
    width: flex-grid(2, 12);
    //width: calc(#{flex-grid-value(2, 12, '%', true)});
}
</style>
