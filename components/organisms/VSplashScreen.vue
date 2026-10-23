<script lang="ts" setup>
import { useWebsiteReveal } from '~/composables/use-website-reveal'
import { SPLASH_ACTIVE_CLASS } from '~/constants/splash-screen'

const state = useSplashScreenState()
const { firstReveal } = useWebsiteReveal()

// The splash never locks the scroll nor catches pointer events: the page
// underneath is usable while it plays. It only delays the entrance reveals.
function onReveal() {
    firstReveal.value = true
}

function onFinish() {
    onReveal()
    state.value = 'done'
    document.documentElement.classList.remove(SPLASH_ACTIVE_CLASS)
}
</script>

<template>
    <VSplashScreenContent
        v-if="state !== 'done'"
        @reveal="onReveal"
        @finish="onFinish"
    />
</template>
