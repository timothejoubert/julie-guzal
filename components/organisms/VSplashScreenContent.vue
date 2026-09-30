<script lang="ts" setup>
import LogoSvg from '~/assets/images/logo.svg?component'
import { SPLASH_ACTIVE_CLASS } from '~/constants/splash-screen'

const emit = defineEmits<{
    reveal: []
    finish: []
}>()

const root = useTemplateRef<HTMLElement>('root')

// The animation is pure CSS and starts on first paint (it doesn't wait for
// hydration). Once mounted, sync the page reveal with the wipe and remove the
// splash when it's over.
onMounted(() => {
    const wipe = document.documentElement.classList.contains(SPLASH_ACTIVE_CLASS)
        ? root.value?.getAnimations()[0]
        : undefined

    if (!wipe) {
        emit('finish')
        return
    }

    const elapsed = Number(wipe.currentTime ?? 0)
    const wipeDelay = Number(wipe.effect?.getComputedTiming().delay ?? 0)
    window.setTimeout(() => emit('reveal'), Math.max(0, wipeDelay - elapsed))

    wipe.finished.finally(() => emit('finish'))
})
</script>

<template>
    <div
        ref="root"
        :class="$style.root"
        aria-hidden="true"
    >
        <LogoSvg :class="$style.logo" />
        <VSpinner
            :class="$style.spinner"
            size="32"
        />
    </div>
</template>

<style lang="scss" module>
.root {
    position: fixed;
    z-index: 999;
    display: none;
    width: 100%;
    height: 100dvh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: initial;
    background-color: var(--theme-color-primary);
    color: var(--theme-color-on-primary);
    inset: 0;

    // Decorative layer: never catch clicks, taps or wheel/touch scroll
    pointer-events: none;

    :global(.splash-active) & {
        display: flex;
        animation: wipe 0.5s ease(out-quad) 0.5s both;
    }

    @media (prefers-reduced-motion: reduce) {
        :global(.splash-active) & {
            display: none;
        }
    }
}

.logo {
    position: absolute;
    z-index: 11;
    width: 78px;
    height: auto;
    animation: fade-out 0.3s ease(out-quad) 0.3s both;
}

.spinner {
    position: absolute;
    right: 24px;
    bottom: 24px;
    margin-top: rem(16);
}

@keyframes wipe {
    from {
        clip-path: inset(0);
    }

    to {
        clip-path: inset(0 0 100% 0);
    }
}

@keyframes fade-out {
    to {
        opacity: 0;
    }
}
</style>
