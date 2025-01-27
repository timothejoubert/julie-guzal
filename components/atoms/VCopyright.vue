<script  lang="ts" setup>
defineProps<{
    content: string
}>()
</script>

<template>
    <figcaption :class="$style.root">
        {{ content }}
    </figcaption>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;
@use 'assets/scss/variables/fonts' as *;

.root {
    font-family: $font-noi;
    margin-block: rem(12) rem(22);
}
</style>
