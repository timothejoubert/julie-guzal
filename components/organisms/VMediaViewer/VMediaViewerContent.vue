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

const customMouseHidden = ref(false)
</script>

<template>
    <dialog
        :id="id"
        ref="root"
        :class="[
            $style.root,
            customMouseHidden && $style['root--custom-cursor-hidden'],
            cursorDisplayed && $style['root--native-cursor-disabled'],
        ]"
        @click="onClick"
    >
        <VFollowCusor v-model="cursorDisplayed" />
        <div
            :class="$style.wrapper"
        >
            <button
                :class="$style.close"
                :aria-label="$t('media_viewer.close')"
                @click="close"
                @mouseover="() => customMouseHidden = true"
                @mouseleave="() => customMouseHidden = false"
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

    &--custom-cursor-hidden {
        --v-follow-cusor-opacity: 0;
    }

    &--native-cursor-disabled {
      cursor: none;
    }
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
    right: 0;
    bottom: min(#{rem(165)}, 12vh);
    left: 0;
    display: flex;
    justify-content: space-evenly;

    @include media('>=md') {
        right: rem(24);
        bottom: rem(24);
        left: initial;
        flex-direction: column;
    }

    @include media('>=lg') {
        display: none;
    }

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

    .root--native-cursor-disabled & {
        cursor: none !important;
    }

    @include media('>=md') {
        align-items: flex-start;
    }

    @include media('>=lg') {
        align-items: flex-end;
    }

}

.slide {
    display: flex;
    width: 100%;
    max-height: 100%;
    flex-direction: column;
    flex-shrink: 0;
    justify-content: space-between;
    column-gap: var(--gutter);
    padding-inline: var(--gutter);
    scroll-snap-align: start;

    @include media('>=md') {
        height: 100%;
    }

    @include media('>=lg') {
        flex-direction: row;
        align-items: flex-end;
        justify-content: initial;
    }

}

.image {
    width: 100%;
    max-height: 70vh;
    object-fit: contain;
    object-position: center;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;

    @include media('>=md') {
        width: flex-grid(10, 12);
        max-height: 80vh;
        object-position: left;
    }

    @include media('>=lg') {
        width: flex-grid(6, 12);
        max-height: calc(100vh - var(--gutter) * 2);
        object-position: right;
    }
}

.figcaption {
    max-width: 26ch;
    margin-top: min(#{rem(210)}, 15vh);
    font-family: $font-suisse-family;
    font-size: rem(14);
    font-weight: 400;
    line-height: 1.42;

    > * {
        margin-block: 0;
    }

    @include media('>=lg') {
        width: flex-grid(2, 12);
        margin-top: initial;
    }

}
</style>
