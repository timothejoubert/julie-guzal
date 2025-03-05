<script lang="ts">
import type Plyr from 'plyr'
import type { PropType } from 'vue'
import { commonVideoProps, embedVideoProps, videoAttributes, videoSrc } from '~/utils/video/video-props'
import { getVideoAttrsValues } from '~/utils/video/video-attributes'
import { getEmbedSrc } from '~/utils/embed'

export const vVideoPlayerProps = {
    ...videoSrc,
    ...videoAttributes,
    ...embedVideoProps,
    ...commonVideoProps,
    plyr: { type: Object as PropType<Plyr.Options> },
}

export default defineComponent({
    props: vVideoPlayerProps,
    setup(props) {
        const isEmbed = computed(() => !!props.embedPlatform && !!props.embedId)

        // Attributes
        const videoAttrsValue = computed(() => getVideoAttrsValues(props, props.background))

        const playsinline = computed(() => videoAttrsValue.value.playsinline)
        const muted = computed(() => videoAttrsValue.value.muted)
        const loop = computed(() => videoAttrsValue.value.loop)
        const autoplay = computed(() => videoAttrsValue.value.autoplay)
        const controls = computed(() => videoAttrsValue.value.controls)

        const videoAttrs = computed(() => {
            return {
                width: props.width,
                height: props.height,
                playsinline: playsinline.value ? '' : undefined,
                muted: muted.value ? '' : undefined,
                loop: loop.value ? '' : undefined,
                autoplay: autoplay.value ? '' : undefined,
                controls: controls.value ? '' : undefined,
            }
        })

        const src = computed(() => {
            if (isEmbed.value && props.embedPlatform) {
                let params: Record<string, string> = {}

                const platform = props.embedPlatform.toLowerCase()
                // TODO: prefers use www.youtube-nocookie.com rather than www.youtube.com/
                if (platform === 'youtube') {
                    params = {
                        iv_load_policy: '3',
                        modestbranding: '1',
                        playsinline: '1',
                        showinfo: '0',
                        rel: '0',
                        enablejsapi: '1',
                        muted: muted.value ? '1' : '0',
                        controls: controls.value ? '1' : '0',
                        autoplay: autoplay.value ? '1' : '',
                        loop: loop.value ? '1' : '0',

                    }
                }
                else if (platform === 'vimeo') {
                    params = {
                        byline: 'false',
                        portrait: 'false',
                        title: 'true',
                        speed: 'false',
                        transparent: '0',
                        gesture: 'media',
                        autopause: '0',
                        muted: muted.value ? '1' : '0',
                        autoplay: autoplay.value ? '1' : '0',
                        controls: controls.value ? '1' : '0',
                        loop: loop.value ? '1' : '0',
                        sidedock: '0',
                        title: '0',
                        dnt: '1', // remove cookie
                    }
                }

                return getEmbedSrc(props.embedId as string, platform, params)
            }
            else {
                return props.src
            }
        })

        // Native video
        const videoSources = computed(() => {
            if (isEmbed.value) return []

            const altSources = (props.altSources || [])
                .filter(file => !!file.relativePath)
                .map((file) => {
                    return {
                        src: file.relativePath,
                        type: file.mimeType,
                    }
                })
            return [{ src: src.value, type: props.mimeType || 'video/mp4' }, ...altSources]
        })

        // STYLE
        const ratio = computed(() => {
            const validRatio = props.width && props.height && Number(props.width) / Number(props.height)
            if (validRatio) return validRatio
            else return 16 / 9
        })

        const playerSize = ref<number[]>([])
        const playerStyle = computed(() => {
            const style: Record<string, string | number> = {}

            if (playerSize.value.length) {
                style.width = playerSize.value[0] + 'px'
                style.height = playerSize.value[1] + 'px'
            }
            else {
                style.aspectRatio = ratio.value
            }

            return style
        })

        return { controls, isEmbed, playerStyle, videoAttrs, videoSources, src }
    },
})
</script>

<template>
    <div
        v-if="isEmbed"
        :style="playerStyle"
        :class="[$style['iframe-wrapper'], !controls && $style['iframe-wrapper--no-controls']]"
    >
        <iframe
            :src="src"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            :class="$style.iframe"
        />
        <!--        <VSpinner v-if="!videoReady" :class="$style.spinner" /> -->
    </div>
    <video
        v-else
        v-bind="videoAttrs"
        ref="playerComponent"
        :class="$style.video"
    >
        <source
            v-for="source in videoSources"
            :key="source.src"
            :src="source.src"
            :type="source.type"
        >
    </video>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;

@mixin video-properties {
    position: var(--v-player-video-position);
    width: var(--v-player-video-width, 100%);
    max-width: var(--v-player-video-max-width, 100%);
    height: var(--v-player-video-height, auto);
    object-fit: var(--v-player-video-object-fit);
}

.iframe-wrapper {
    width: 100%;
    height: 100%;

    &--no-controls {
        // Scroll on element make smooth scroll buggy
        pointer-events: none;
    }

    .video,
    .iframe {
        @include video-properties;
    }
}

.iframe,
.video {
    @include video-properties;
}

.spinner {
    position: absolute;
    z-index: 10;
    top: calc(50% - #{rem(35)});
    left: calc(50% - #{rem(35)});
    width: rem(70);
    height: rem(70);
}
</style>
