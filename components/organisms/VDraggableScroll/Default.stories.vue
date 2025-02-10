<script setup lang="ts">

</script>

<template>
    <NuxtStory>
        <VDraggableScroll :class="$style.scroller">
            <div
                v-for="index in 20"
                :key="index"
                :class="$style.item"
            >
                Item: {{ index }}
            </div>
        </VDraggableScroll>
    </NuxtStory>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;

.scroller {
    width: 60vw;
    gap: rem(30);
}

.item {
    display: flex;
    width: 20vw;
    height: rem(100);
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    background-color: lightgrey;
}
</style>
