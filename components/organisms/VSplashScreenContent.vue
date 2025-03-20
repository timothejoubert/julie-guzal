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
        }, 1500)
    }
    state.value = 'leave'
}

function onStart() {
    state.value = 'enter'
}

const { startCounter } = useCounter({
    duration: 600,
    onFinish,
    onStart,
})

onMounted(startCounter)

// Style
const $style = useCssModule()
const rootClasses = computed(() => {
    return [
        $style.root,
        state.value !== 'pending' && $style['root--started'],
        state.value === 'enter' && $style['root--enter'],
        state.value === 'leave' && $style['root--leave'],
    ]
})
</script>

<template>
    <div
        ref="root"
        :class="rootClasses"
        :aria-label="$t('splash_screen_loading')"
    >
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

    // background-color: var(--theme-color-primary);
    // color: var(--theme-color-on-primary);
     background-color: var(--theme-color-background);
     color: var(--theme-color-on-background);
    inset: 0;
    transition: opacity 0.6s ease(out-quad);

    &--leave {
        opacity: 0;
    }
}

.logo {
    width: 78px;
    height: auto;
}

.spinner {
    position: absolute;
    right: 24px;
    bottom: 24px;
    margin-top: rem(16);

    //font-family: $font-suisse-family;
    //font-size: rem(16);
    //font-weight: 400;
}
</style>
