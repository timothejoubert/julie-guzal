<script lang="ts" setup>
import type Plyr from 'plyr'
import VDraggableScroll from '~/components/organisms/VDraggableScroll/VDraggableScroll.vue'
import VFollowCusor from '~/components/organisms/VFollowCusor.vue'

const id = useId()

const { documents, index: slideIndex, close, nextSlide, previousSlide, onStart, onEnd } = useMediaViewer()

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

// ROOT CLICK LISTENER
const cursorDisplayed = ref(false)
function onClick(event: MouseEvent) {
    if (!cursorDisplayed.value) return

    if (event.clientX > window.innerWidth / 2) nextSlide()
    else previousSlide()
}
</script>

<template>
    <dialog
        :id="id"
        ref="root"
        :class="$style.root"
        @click="onClick"
    >
        <VFollowCusor v-model="cursorDisplayed" />
        <div>{{ cursorDisplayed }}</div>
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
                    :disabled="onStart"
                    @click="previousSlide"
                >
                    <VIcon name="arrow-left" />
                </button>
                <button
                    :class="[$style.control, $style['control--next']]"
                    :aria-label="$t('carousel.next')"
                    :disabled="onEnd"
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
                        sizes="xs:95vw md:95vw lg:40vw vl:40vw xl:40vw hd:40vw qhd:40vw"
                    />
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
    overflow: hidden;
    width: 100%;
    max-width: initial;
    height: 100%;
    max-height: initial;
    align-items: center;
    justify-content: center;
    padding: initial;
    border: initial;
    margin: initial;
    background-color: var(--theme-color-background);
    color: var(--theme-color-on-background);
    inset: 0;

    @include theme('light');
}

.wrapper {
    height: 100%;
    padding-block: rem(24);
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
    right: rem(24);
    bottom: rem(24);
}

.control {
    display: flex;
    align-items: center;
    justify-content: center;
    border: initial;
    background-color: initial;
    cursor: pointer;

    &[disabled="true"] {
        color: var(--color-brand-inactive);
    }
}

.medias {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: flex-end;
}

.slide {
    display: flex;
    width: 100%;
    max-height: 100%;
    flex-shrink: 0;
    align-items: flex-end;
    column-gap: var(--gutter);
    padding-inline: var(--gutter);
    scroll-snap-align: start;
}

.image {
    width: 100%;
    max-height: calc(100vh - var(--gutter) * 2);
    object-fit: contain;
    object-position: right;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;

    // width: calc(#{flex-grid-value(5, 12, '%', true)});

    @include media('>=lg') {
        width: flex-grid(6, 12);
    }
}

.figcaption {
    width: flex-grid(2, 12);
    font-family: $font-suisse-family;
    font-size: rem(14);
    font-weight: 400;
    line-height: 1.42;

    // width: calc(#{flex-grid-value(2, 12, '%', true)});
}
</style>
