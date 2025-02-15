<script setup lang="ts">
import { useBodyScrollLock } from '~/composables/use-body-scroll-lock'

const $style = useCssModule()
const { isLoading } = useLoadingIndicator()
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
