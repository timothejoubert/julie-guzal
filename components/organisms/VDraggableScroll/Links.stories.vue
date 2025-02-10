<script setup lang="ts">

</script>

<template>
    <NuxtStory>
        <template #aside>
            <p>Interactive element has default drag behavior that interfere with the parent draggable section.</p>
        </template>
        <NuxtStoryVariant title="Default">
            <VDraggableScroll :class="$style.scroller">
                <a
                    v-for="index in 20"
                    :key="index"
                    href="/"
                    :class="$style.item"
                >
                    Item: {{ index }}
                </a>
            </VDraggableScroll>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="CSS user-drag">
            <VDraggableScroll :class="$style.scroller">
                <a
                    v-for="index in 20"
                    :key="index"
                    href="/"
                    :class="[$style.item, $style['item--prevent-drag']]"
                >
                    Item: {{ index }}
                </a>
            </VDraggableScroll>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="draggable attribute">
            <VDraggableScroll :class="$style.scroller">
                <a
                    v-for="index in 20"
                    :key="index"
                    draggable="false"
                    href="/"
                    :class="[$style.item, $style['item--prevent-drag']]"
                >
                    Item: {{ index }}
                </a>
            </VDraggableScroll>
        </NuxtStoryVariant>
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

    &--prevent-drag {
        -webkit-user-drag: none;

        // user-drag: none;
        // user-select: none;
        // -moz-user-select: none;
        // -webkit-user-select: none;
        // -ms-user-select: none;
    }
}
</style>
