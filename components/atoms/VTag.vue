<script  lang="ts" setup="">
defineProps({
    label: String,
})
</script>

<template>
    <div
        :class="$style.root"
        class="text-tag-md"
    >
        {{ label }}
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;
@use 'assets/scss/variables/fonts' as *;

.root {
    color: var(--theme-color-on-background);
    font-family: $font-suisse-family;
    font-size: rem(14);
    font-weight: 300;
    line-height: 1.3;
}
</style>
