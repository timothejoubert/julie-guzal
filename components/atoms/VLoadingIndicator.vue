<script setup lang="ts">
const $style = useCssModule()
const { isLoading } = useLoadingIndicator()

watch(isLoading, () => {
    if (isLoading.value) {
        document.body.classList.add($style.loading)
    }
    else {
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
