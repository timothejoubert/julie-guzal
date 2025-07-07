<script lang="ts" setup>
// import lottie from 'lottie-web'
// import lottieData from '~/assets/lottie/splash-screen-lottie-final.json'
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

const START_LEAVE = 2600
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
    startCounter()
}

// VIDEO
const videoEl = useTemplateRef<HTMLMediaElement>('video')
onMounted(() => {
    if (videoEl.value?.readyState === 4) playVideo()
    else videoEl.value?.addEventListener('canplaythrough', playVideo, { once: true })
})

// LOTTIE animation
// const lottieContainer = useTemplateElement<HTMLElement>('lottieContainer')
// const lottieElMounted = ref(false)
// onMounted(() => {
//     if (!lottieContainer.value) return

//     const lottieAnimation = lottie.loadAnimation({
//         container: lottieContainer.value,
//         renderer: 'canvas',
//         loop: true,
//         autoplay: false,
//         // path: 'https://assets10.lottiefiles.com/packages/lf20_soCRuE.json',
//         animationData: lottieData,
//         rendererSettings: {
//             preserveAspectRatio: 'xMinYMin slice', // Supports the same options as the svg element's preserveAspectRatio property
//             title: 'Loading screen', // Adds SVG title element for accessible animation title
//             description: 'Splash screen animation that contain art direction & branding, interactive design.', // Adds SVG desc element for accessible long description of animation
//             progressiveLoad: false, // Boolean, only svg renderer, loads dom elements when needed. Might speed up initialization for large number of elements.
//             hideOnTransparent: true, // Boolean, only svg renderer, hides elements when opacity reaches 0 (defaults to true)
//             className: $style.lottie,
//         },
//     })

//     lottieAnimation.addEventListener('complete', () => {
//         console.log('Lottie animation finished')
//     })

//     lottieAnimation.addEventListener('loopComplete', () => {
//         console.log('Lottie animation loopComplete')
//     })

//     lottieAnimation.addEventListener('data_failed', () => {
//         console.error('Lottie failed to parse the JSON')
//     })

//     lottieAnimation.addEventListener('DOMLoaded', () => {
//         lottieElMounted.value = true
//         console.log('Lottie animation DOMLoaded')
//         lottieAnimation.play()
//     })
// })
</script>

<template>
    <div
        ref="root"
        :class="rootClasses"
        :aria-label="$t('splash_screen_loading')"
        aria-live="polite"
        aria-atomic="true"
    >
        <video
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
        </video>
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
    color: var(--theme-color-on-primary);
    inset: 0;
    transition: clip-path 0.4s ease(out-quad);
    clip-path: inset(0px);

    &--leave {
        clip-path: inset(0px 0px 100% 0px);
    }
}

.video {
    height: 100%;
    width: auto;
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
    width: 78px;
    height: auto;
    z-index: 11;
    transition: 0.3s ease(out-quad);
    opacity: 0;

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
