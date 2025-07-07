<script lang="ts" setup>
import LogoSvg from '~/assets/images/logo.svg?component'

const state = useSplashScreenState()
const root = ref<HTMLElement | null>(null)

function onFinish() {
    if (root.value) {
        root.value.addEventListener('transitionend', () => {
            state.value = 'done'
        }, { once: true })
    }
    else {
        window.setTimeout(() => {
            state.value = 'done'
        }, 500)
    }

    state.value = 'leave'
}

const START_LEAVE = 400
const { startCounter } = useCounter({
    duration: START_LEAVE,
    onFinish,
    onStart: () => (state.value = 'enter'),
})

// Style
const $style = useCssModule()
const rootClasses = computed(() => {
    return [
        $style.root,
        state.value !== 'pending' && $style['root--started'],
        state.value === 'pending' && $style['root--pending'],
        state.value === 'enter' && $style['root--enter'],
        state.value === 'leave' && $style['root--leave'],
    ]
})

function playVideo() {
    videoEl.value?.play()
}

// VIDEO
const videoEl = useTemplateRef<HTMLMediaElement>('video')
onMounted(() => {
    startCounter()
    if (videoEl.value?.readyState === 4) {
        playVideo()
    }
    else {
        videoEl.value?.addEventListener('canplaythrough', playVideo, { once: true })
        videoEl.value?.addEventListener('canplay', playVideo, { once: true })
    }
    window.setTimeout(() => {
        // Not playing on mobile
        if (state.value === 'pending' || state.value === 'enter') playVideo()
    }, videoEl.value ? 3200 : 0)
})
</script>

<template>
    <div
        ref="root"
        :class="rootClasses"
        :aria-label="$t('splash_screen_loading')"
        aria-live="polite"
        aria-atomic="true"
    >
        <!-- <video
            ref="video"
            :class="$style.video"
            muted
            playsinline
            loop
            preload="auto"
        >
            <source
                src="/splash.webm"
                type="video/webm"
            >
            <source
                src="/splash.mp4"
                type="video/mp4"
            >
            Votre navigateur ne supporte pas les vidéos HTML5.
        </video> -->
        <LogoSvg :class="$style.logo" />
        <VSpinner
            :class="$style.spinner"
            size="32"
        />
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/variables/fonts' as *;

.root {
    position: fixed;
    z-index: 999;
    display: flex;
    width: 100%;
    height: 100dvh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: initial;
    background-color: var(--theme-color-primary);
    clip-path: inset(0);
    color: var(--theme-color-on-primary);
    inset: 0;
    transition: clip-path 0.5s ease(out-quad);

    &--leave {
        clip-path: inset(0 0 100% 0);
    }
}

.video {
    width: auto;
    height: 100%;
}

.lottie {
    position: absolute;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s;

    .root--lottie-mounted & {
        opacity: 1;
    }
}

.logo {
    position: absolute;
    z-index: 11;
    width: 78px;
    height: auto;
    opacity: 0;
    transition: 0.3s ease(out-quad);

    .root--pending & {
        opacity: 1;
    }
}

.spinner {
    position: absolute;
    right: 24px;
    bottom: 24px;
    margin-top: rem(16);
}
</style>
