<script lang="ts" setup>
import type { PropType } from 'vue'
import type { EmbedField, LinkToMediaField } from '@prismicio/types'
import { commonVideoProps, videoAttributes } from '~/utils/video/video-props'
import type { PrismicVideoField } from '~/utils/prismic/prismic-media'
import type { vPrismicImageProps } from '~/components/atoms/VPrismicImage'
import type { PossibleMedia } from '~/composables/use-prismic-media'

const props = defineProps({
    ...commonVideoProps,
    ...videoAttributes,
    document: { type: Object as PropType<PossibleMedia> },
    linkToMediaField: { type: Object as PropType<LinkToMediaField> },
    embedField: { type: Object as PropType<EmbedField> },
    video: { type: Object as PropType<PrismicVideoField> },
    thumbnail: { type: Object as PropType<vPrismicImageProps> },
})

const hasThumbnail = computed(() => !!props.thumbnail?.document?.url)

const slots = useSlots()
const hasLazyVideoPlayer = computed(() => {
    return hasThumbnail.value || !!slots.default?.()
})

const videoData = computed(() => {
    if (props.embedField?.embed_url) {
        const embedId = new URL(props.embedField.embed_url)?.pathname?.substring(1)

        return {
            width: props.embedField.width,
            height: props.embedField.height,
            embedPlatform: props.embedField.provider_name,
            embedId,
            autoplay: hasLazyVideoPlayer.value,
        }
    }
    else if (props.linkToMediaField?.url) {
        return {
            width: props.linkToMediaField?.width,
            height: props.linkToMediaField?.height,
            src: props.linkToMediaField?.url,
        }
    }
    else if (props.document?.src) {
        return props.document
    }

    return {}
})

const videoAttrs = computed(() => {
    const width = props.embedField?.width || props.linkToMediaField?.width || props.document?.width || props?.width || 1920
    const height = props.embedField?.height || props.linkToMediaField?.height || props.document?.height || props?.height || 1080

    const attrs = Object.entries(props).reduce((acc, [key, value]) => {
        if ((key in commonVideoProps || key in videoAttributes)) acc[key] = value
        return acc
    }, {})

    return {
        ...attrs,
        width,
        height,
    }
})

const videoProps = computed(() => {
    return {
        ...videoData.value,
        ...videoAttrs.value,
    }
})

const videoRatio = computed(() => {
    return Number(videoAttrs.value.width) / Number(videoAttrs.value.height)
})

// Video interaction
const hadInteraction = ref(false)
const onClick = (event: Event) => {
    if (event.defaultPrevented || !props.playsinline) return

    hadInteraction.value = true
}

const onVideoEnded = () => (hadInteraction.value = false)
</script>

<template>
    <div
        v-if="hasLazyVideoPlayer"
        :class="[$style.root, hadInteraction && $style['root--had-interaction']]"
        :style="!!videoRatio && { aspectRatio: videoRatio }"
    >
        <button
            :aria-label="$t('play_video')"
            :class="$style.button"
            @click="onClick"
        >
            <VIcon
                name="play"
                aria-hidden="true"
            />
        </button>
        <slot>
            <VPrismicImage
                v-if="hasThumbnail"
                v-bind="thumbnail"
                :class="$style.thumbnail"
                @click="onClick"
            />
            <div
                v-else
                :class="[$style.thumbnail, $style['thumbnail--placeholder']]"
                :style="{ aspectRatio: videoRatio || 16 / 9 }"
            />
        </slot>
        <VVideoPlayer
            v-if="hadInteraction"
            v-bind="videoProps"
            :autoplay="true"
            :plyr="{ listener: { ended: onVideoEnded } }"
            :class="$style.video"
        />
    </div>
    <VVideoPlayer
        v-else
        v-bind="videoProps"
        :class="$style.video"
    />
</template>

<style lang="scss" module="">
@use 'assets/scss/functions/rem' as *;

.root {
    --v-player-position: absolute;
    --v-player-height: 100%;
    --v-player-width: 100%;

    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.button {
    --v-button-position: absolute;

    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    width: rem(52);
    height: rem(52);
    border: none;
    border-radius: 100%;
    background-color: white;
    cursor: pointer;
    transform: translate(-50%, -50%);

    .root--had-interaction & {
        pointer-events: none;
        visibility: hidden;
    }
}

.thumbnail {
    width: 100%;
    cursor: pointer;

    .root--had-interaction & {
        display: none;
        pointer-events: none;
        visibility: hidden;
    }

    &--placeholder {
        position: relative;
        aspect-ratio: 16 / 9;

        // background-color: color(grey-50);

        &::after {
            position: absolute;
            background: linear-gradient(45deg, rgba(0, 0, 0, 80%) 0%, transparent 100%);
            content: '';
            inset: 0;
        }
    }
}

.video {
    display: block;
}
</style>
