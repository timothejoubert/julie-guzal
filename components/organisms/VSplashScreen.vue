<script lang="ts" setup>
import { useWebsiteReveal } from '~/composables/use-website-reveal'

const state = useSplashScreenState()
const { firstReveal } = useWebsiteReveal()

const SCROLL_LOCK_CLASS = 'body--scroll-lock'
useServerHead({
    bodyAttrs: {
        class: SCROLL_LOCK_CLASS,
    },
})

function onAfterLeave() {
    firstReveal.value = true
    window.scrollTo({ top: 0 })
    document.body.classList.remove(SCROLL_LOCK_CLASS)
}
</script>

<template>
    <Transition
        :name="$style.root"
        @after-leave="onAfterLeave"
    >
        <LazyVSplashScreenContent v-if="state !== 'done'" />
    </Transition>
</template>

 <style lang="scss">
 body.body--scroll-lock {
     overflow: hidden;
     max-height: 100vh;
 }
 </style>

<style lang="scss" module>
.root {
    &:global(#{'-enter-active'}),
    &:global(#{'-leave-active'}) {
        transition-duration: 0.5s;
        transition-property: opacity, scale;
        transition-timing-function: ease(out-quad), ease(out-quart);
    }

    &:global(#{'-enter-from'}),
    &:global(#{'-leave-to'}) {
        opacity: 0;
        scale: 0.9;
    }
}
</style>
