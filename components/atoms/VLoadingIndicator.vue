<script setup lang="ts">
import { useBodyScrollLock } from '~/composables/use-body-scroll-lock'

const $style = useCssModule()
const { isLoading, finish } = useLoadingIndicator()
const { disableScroll, enabledScroll } = useBodyScrollLock()

watch(isLoading, () => {
    if (isLoading.value) {
        disableScroll()
        document.body.classList.add($style.loading)
    }
    else {
        enabledScroll()
        document.body.classList.remove($style.loading)
    }
})

// Sometimes (mainly in the event page), the loader get stucks and never ends.
// @see https://github.com/nuxt/nuxt/issues/25840#issuecomment-2604644426
const nuxtApp = useNuxtApp()

nuxtApp.hook('page:finish', () => finish())
</script>

<template>
    <NuxtLoadingIndicator
        :height="4"
        color="#fff"
    />
</template>

<style lang="scss" module>
.loading,
.loading a,
.loading button {
    cursor: wait !important;
}
</style>
