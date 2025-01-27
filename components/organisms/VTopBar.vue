<script  lang="ts" setup>
</script>

<template>
    <div
        :class="$style.root"
        class="grid-width"
    >
        <div>Title</div>
        <VNav />
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;
@use 'assets/scss/functions/flex-grid' as *;
@use 'assets/scss/mixins/include-media' as *;

.root {
    position: sticky;
    z-index: 101;
    top: 0;
    display: flex;
}
</style>
