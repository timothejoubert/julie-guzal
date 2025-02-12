<script lang="ts" setup>
import LogoSvg from '~/assets/images/logo.svg?component'

const state = useSplashScreenState()
const root = ref<HTMLElement | null>(null)

const onCounterFinish = () => {
    if (root.value) {
        root.value.addEventListener('transitionend', () => {
            state.value = 'done'
        }, { once: true })
    }
    else {
        window.setTimeout(() => {
            state.value = 'done'
        }, 600)
    }
    state.value = 'leave'
}

const { startCounter, counterOutput } = useCounter({ options: { duration: 1200 }, onFinish: onCounterFinish })

onMounted(() => {
    state.value = 'enter'
    startCounter()
})

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
    >
        <LogoSvg :class="$style.logo" />
        <div :class="$style.counter">
            {{ counterOutput }} %
        </div>
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/variables/fonts' as *;

.root {
    position: fixed;
    z-index: 1001;
    display: flex;
    height: 100svh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--theme-color-primary);
    color: var(--theme-color-on-primary);
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

.counter {
    position: absolute;
    bottom: 24px;
    right: 24px;
    margin-top: rem(16);
    font-family: $font-suisse-family;
    font-size: rem(16);
    font-weight: 400;
}
</style>
