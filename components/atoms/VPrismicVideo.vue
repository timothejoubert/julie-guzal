<script lang="ts" setup>
import type { PropType } from 'vue'
import { commonVideoProps, videoAttributes } from '~/utils/video/video-props'
import type { vPrismicImageProps } from '~/components/atoms/VPrismicImage'
import type { PossibleMedia } from '~/composables/use-prismic-media'
import { isVideoEmbedField } from '~/utils/prismic/guard'

const props = defineProps({
    ...commonVideoProps,
    ...videoAttributes,
    document: { type: Object as PropType<PossibleMedia> },
    thumbnail: { type: Object as PropType<PossibleMedia> },
    thumbnailProps: { type: Object as PropType<vPrismicImageProps> },
})

const hasThumbnail = computed(() => !!usePrismicMedia(props.thumbnail).url.value)

const slots = useSlots()
const hasLazyVideoPlayer = computed(() => {
    return hasThumbnail.value || !!slots.default?.()
})

const videoData = computed(() => {
    const embedData = {}

    if (isVideoEmbedField(props.document)) {
        Object.assign(embedData, {
            embedPlatform: props.document.provider_name,
            embedId: new URL(props.document.embed_url)?.pathname?.substring(1),
            autoplay: hasLazyVideoPlayer.value || props.autoplay,
        })
    }

    return {
        ...embedData,
        ...(props.document || {}),
        src: props.document?.src || props.document?.url,
    }
})

const videoAttrs = computed(() => {
    const width = props.document?.width || props?.width || 1920
    const height = props.document?.height || props?.height || 1080

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

const thumbnailProps = computed(() => {
    const result = {
        document: props.thumbnail,
        ...(props.thumbnailProps || {}),
    }

    if (videoAttrs.value.width && videoAttrs.value.height) {
        Object.assign(result, {
            fit: 'crop',
            ar: `${videoAttrs.value.width}:${videoAttrs.value.height}`,
            width: videoAttrs.value.width,
            height: videoAttrs.value.height,
        })
    }

    return result
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
                width="18"
                height="18"
            />
        </button>
        <VPrismicImage
            v-if="hasThumbnail"
            v-bind="thumbnailProps"
            :class="$style.thumbnail"
            @click="onClick"
        />
        <div
            v-else
            :class="[$style.thumbnail, $style['thumbnail--placeholder']]"
            :style="{ aspectRatio: videoRatio || 16 / 9 }"
        />
        <VVideoPlayer
            v-if="hadInteraction"
            v-bind="videoProps"
            :autoplay="true"
            :plyr="{ listener: { ended: onVideoEnded } }"
            :class="[$style.video, $style['video--with-thumbnail']]"
        />
    </div>
    <VVideoPlayer
        v-else
        v-bind="videoProps"
        :class="$style.video"
    />
</template>

<style lang="scss" module>
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
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    top: 50%;
    left: 50%;
    width: rem(32);
    height: rem(32);
    border: none;
    border-radius: 100%;
    background-color: white;
    cursor: pointer;
    transform: translate(-50%, -50%);
    padding: initial;

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
    --v-player-video-height: 100%;

    display: block;
}
</style>
