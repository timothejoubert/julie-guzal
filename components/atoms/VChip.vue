<script  lang="ts" setup>
export interface VChipProp {
    label: string
    active?: boolean
}
defineProps<VChipProp>()
</script>

<template>
    <button :class="[$style.root, active && $style['root--active']]">
        {{ label }}
        <span :class="$style.icon" />
    </button>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;

.root {
    display: flex;
    align-items: center;
    border: none;
    border-radius: rem(4);
    background-color: var(--theme-color-secondary-variant);
    color: var(--theme-color-primary);
    cursor: pointer;
    gap: rem(6);
    padding-block: rem(9);
    padding-inline: rem(12);
}

.icon {
    position: relative;
    display: flex;
    width: rem(16);
    height: rem(16);
    align-items: center;
    justify-content: center;
    border: 1px solid currentcolor;
    border-radius: rem(4);
    transition: opacity 0.2s ease(out-quad);

    &::before,
    &::after {
        position: absolute;
        background-color: currentcolor;
        content: '';
        opacity: 0;
        rotate: 45deg;
        transform-origin: center;
        transition: opacity 0.3s ease(out-quad);
    }

    &::before {
        width: 100%;
        height: 1px;
    }

    &::after {
        width: 1px;
        height: 100%;
    }

    .root--active &::before,
    .root--active &::after {
        opacity: 1;
    }
}
</style>
