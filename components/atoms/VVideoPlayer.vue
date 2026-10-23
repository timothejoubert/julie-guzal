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
    // Embed title (Prismic oEmbed `title`), used as the iframe accessible name
    title: { type: String },
}

export default defineComponent({
    props: vVideoPlayerProps,
    setup(props) {
        const isEmbed = computed(() => !!props.embedPlatform && !!props.embedId)

        // Attributes
        const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
        const videoAttrsValue = computed(() => getVideoAttrsValues(props, props.background, reduceMotion.value))

        const playsinline = computed(() => videoAttrsValue.value.playsinline)
        const muted = computed(() => videoAttrsValue.value.muted)
        const loop = computed(() => videoAttrsValue.value.loop)
        const autoplay = computed(() => videoAttrsValue.value.autoplay)
        const controls = computed(() => videoAttrsValue.value.controls)
        // Muted looping video without controls (autoplay/background): needs its own pause button (RGAA 13.8 / WCAG 2.2.2)
        const isAmbient = computed(() => videoAttrsValue.value.ambient)

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

        // Only load the media once it gets close to the viewport: native `loading="lazy"` starts up to
        // ~2500px ahead on mobile (and doesn't exist for <video>), which autoplayed every video on load.
        const iframeWrapper = useTemplateRef<HTMLElement>('iframeWrapper')
        const videoElement = useTemplateRef<HTMLVideoElement>('playerComponent')
        const isNear = useElementVisibility(() => iframeWrapper.value || videoElement.value, { rootMargin: '200px' })
        const hasBeenNear = ref(false)
        const stopWatch = watch(isNear, (value) => {
            if (!value) return
            hasBeenNear.value = true
            stopWatch()
        })

        // No-JS fallback. Rendered with v-html so that, when JS runs, the iframe stays inert noscript text
        // instead of a real (loading) element created by Vue.
        const iframeNoscript = computed(() => {
            if (!isEmbed.value || !src.value) return ''
            const escapedSrc = src.value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
            return `<iframe src="${escapedSrc}" frameborder="0" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" style="width:100%;height:100%"></iframe>`
        })

        // Play / pause of ambient videos
        const iframeElement = useTemplateRef<HTMLIFrameElement>('iframeElement')
        const isPaused = ref(!autoplay.value)
        watch(autoplay, value => (isPaused.value = !value))

        function postEmbedCommand(play: boolean) {
            const target = iframeElement.value?.contentWindow
            if (!target) return
            const platform = props.embedPlatform?.toLowerCase()
            if (platform === 'youtube') {
                target.postMessage(JSON.stringify({ event: 'command', func: play ? 'playVideo' : 'pauseVideo', args: [] }), '*')
            }
            else if (platform === 'vimeo') {
                target.postMessage(JSON.stringify({ method: play ? 'play' : 'pause' }), '*')
            }
        }

        function togglePlay() {
            const play = isPaused.value
            if (isEmbed.value) {
                postEmbedCommand(play)
                isPaused.value = !play
            }
            else if (videoElement.value) {
                if (play) videoElement.value.play().catch(() => {})
                else videoElement.value.pause()
            }
        }

        return { controls, isAmbient, isEmbed, isPaused, togglePlay, playerStyle, videoAttrs, videoSources, src, hasBeenNear, iframeNoscript }
    },
})
</script>

<template>
    <div
        v-if="isEmbed"
        ref="iframeWrapper"
        :style="playerStyle"
        :class="[$style['iframe-wrapper'], !controls && $style['iframe-wrapper--no-controls']]"
    >
        <iframe
            ref="iframeElement"
            :src="hasBeenNear ? src : undefined"
            :title="title || $t('video.embed_title')"
            frameborder="0"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            :class="$style.iframe"
        />
        <!-- eslint-disable-next-line vue/no-v-html -- built from the escaped embed URL; v-html keeps it raw text when JS runs -->
        <noscript v-html="iframeNoscript" />
        <button
            v-if="isAmbient"
            type="button"
            :class="$style.toggle"
            :aria-label="isPaused ? $t('play_video') : $t('video.pause')"
            @click="togglePlay"
        >
            <VIcon
                v-if="isPaused"
                name="play"
                width="14"
                height="14"
            />
            <span
                v-else
                :class="$style['pause-icon']"
                aria-hidden="true"
            />
        </button>
        <!--        <VSpinner v-if="!videoReady" :class="$style.spinner" /> -->
    </div>
    <div
        v-else-if="isAmbient"
        :class="$style['video-wrapper']"
    >
        <video
            v-bind="videoAttrs"
            ref="playerComponent"
            :class="$style.video"
            @play="isPaused = false"
            @pause="isPaused = true"
        >
            <source
                v-for="source in hasBeenNear ? videoSources : []"
                :key="source.src"
                :src="source.src"
                :type="source.type"
            >
        </video>
        <button
            type="button"
            :class="$style.toggle"
            :aria-label="isPaused ? $t('play_video') : $t('video.pause')"
            @click="togglePlay"
        >
            <VIcon
                v-if="isPaused"
                name="play"
                width="14"
                height="14"
            />
            <span
                v-else
                :class="$style['pause-icon']"
                aria-hidden="true"
            />
        </button>
    </div>
    <video
        v-else
        v-bind="videoAttrs"
        ref="playerComponent"
        :class="$style.video"
        @play="isPaused = false"
        @pause="isPaused = true"
    >
        <source
            v-for="source in hasBeenNear ? videoSources : []"
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

.video-wrapper {
    position: relative;
}

.toggle {
    position: absolute;
    z-index: 2;
    right: rem(12);
    bottom: rem(12);
    display: flex;
    width: rem(32);
    height: rem(32);
    align-items: center;
    justify-content: center;
    padding: initial;
    border: none;
    border-radius: 100%;
    background-color: #fff;
    color: #1a1a1a;
    cursor: pointer;
    pointer-events: auto; // the embed wrapper has pointer-events: none without controls
}

.pause-icon {
    width: rem(10);
    height: rem(12);
    border-inline: rem(3) solid currentcolor;
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
