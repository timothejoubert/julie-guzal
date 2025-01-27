<script  lang="ts" setup>
const theme = useUiThemeState()

function switchTheme() {
    theme.value = (theme.value === 'light' ? 'dark' : 'light')
}

const iconName = computed(() => {
    if (theme.value === 'light') return 'sun'
    return 'moon'
})
</script>

<template>
    <button
        :class="[$style.root, $style[`root--theme-${theme}`]]"
        :aria-label="$t('switch_theme_to', { theme })"
        data-theme-toggle
        @click="switchTheme"
    >
        <VIcon
            :name="iconName"
            aria-hidden="true"
            :class="$style.icon"
        />
    </button>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;

.root {
    display: flex;
    align-items: center;
    justify-content: center;
    border: initial;
    background: initial;
    color: inherit;
    cursor: pointer;
}

.icon {
    flex-shrink: 0;
}
</style>
