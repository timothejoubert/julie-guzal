<script lang="ts">
import type Plyr from 'plyr'
import type { PropType } from 'vue'
import type { TemplateElement } from '~/utils/ref/get-html-element'
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

        // PLAYER
        const playerComponent = ref<TemplateElement>(null)
        // const playerElement = computed(() => getHtmlElement(playerComponent.value))

        // let player: Plyr | null = null
        // const $style = useCssModule()
        // async function createPlayer() {
        //     if (player || !playerElement.value) return
        //
        //     const options: Plyr.Options = {
        //         disableContextMenu: false,
        //         controls: ['play', 'progress', 'current-time', 'mute', 'fullscreen'],
        //         autoplay: autoplay.value,
        //         muted: muted.value,
        //         loop: { active: loop.value },
        //         ...props.plyr,
        //         iconUrl: '/images/plyr-icons.svg', // Stored in public folder for now.
        //         iconPrefix: 'plyr-icon',
        //     }
        //     const PlyrClass = await import('plyr').then(module => module.default)
        //
        //     // I don't know why but listeners property is not used by Plyr.
        //     // As a workaround I will define the listeners later with on().
        //     // Remove the listeners property to be sure that the callbacks are not called twice.
        //     delete options.listeners
        //
        //     if (!controls.value) options.controls = []
        //     if (props.background) {
        //         options.clickToPlay = false
        //         options.fullscreen = { enabled: false }
        //     }
        //     if (props.vimeo) options.vimeo = props.vimeo
        //     if (props.youtube) options.youtube = props.youtube
        //
        //     player = new PlyrClass(playerElement.value as HTMLElement, options)
        //
        //     // Add style to new generated plyr DOM
        //     player?.elements.container?.classList.add($style['root-initialized'])
        //
        //     player.on('ready', onPlayerReady)
        //
        //     // Fix listeners into Plyr options because the callbacks are never called.
        //     if (props.plyr?.listeners) {
        //         Object.keys(props.plyr.listeners).forEach(value =>
        //             player!.on(value as keyof Plyr.PlyrEventMap, props.plyr!.listeners![value]),
        //         )
        //     }
        //
        //     if (props.fit === 'cover') {
        //         // useEventListener('resize', updatePlayerSize, { passive: true })
        //         updatePlayerSize()
        //     }
        // }
        // const videoReady = ref(false)
        // // const emits = defineEmits(['ready'])
        // function onPlayerReady() {
        //     if (player && (props.autoplay || props.background)) {
        //         // the player is initialized with muted property as true but sometimes Plyr kept a wrong muted value into localStorage (i.e. muted = false)
        //         // @see https://github.com/sampotts/plyr/issues/838#issuecomment-962596150
        //         player.muted = muted.value
        //         player.play()
        //     }
        //
        //     // emits('ready', player)
        //
        //     videoReady.value = true
        // }
        //
        // function updatePlayerSize() {
        //     // for now, it handles cover size only
        //     const videoRatio = ratio.value || 16 / 9
        //
        //     const wrapperElement = playerElement.value
        //     const width = (wrapperElement?.clientWidth || 0) + 2 // + 2 for hiding a potential antialiasing issue
        //     const height = (wrapperElement?.clientHeight || 0) + 2
        //     const boundsRatio = width / height
        //
        //     if (boundsRatio < videoRatio) {
        //         playerSize.value = [height * videoRatio, height]
        //     }
        //     else {
        //         playerSize.value = [width, width * videoRatio]
        //     }
        // }
        //
        // function disposePlayer() {
        //     player?.destroy()
        //     player = null
        // }
        //
        // onMounted(createPlayer)
        // onBeforeUnmount(disposePlayer)

        function onScroll(event) {
            console.log('onScroll', event)
        }

        return { controls, isEmbed, playerStyle, videoAttrs, videoSources, src, playerComponent }
    },
})
</script>

<template>
    <div
        v-if="isEmbed"
        ref="playerComponent"
        :style="playerStyle"
        :class="[$style['iframe-wrapper'], !controls && $style['iframe-wrapper--no-controls']]"
    >
        <iframe
            :src="src"
            frameborder="0"
            allow="autoplay"
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
