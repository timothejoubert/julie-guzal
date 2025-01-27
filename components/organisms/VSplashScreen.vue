<script lang="ts" setup>
const settingsDocument = await usePrismicSettingsDocument()
const siteName = settingsDocument?.data.site_name

const state = useSplashScreen()

const reveal = ref(false)

// Style
const $style = useCssModule()
const rootClasses = computed(() => {
    return [
        $style.root,
        reveal.value && $style['root--reveal'],
        state.value !== 'pending' && $style['root--started'],
        state.value === 'leave' && $style['root--leave'],
    ]
})
</script>

<template>
    <div
        :class="rootClasses"
    >
        <button @click="() => reveal = !reveal">
            Reveal : {{ reveal }}
        </button>
        <br>
        <br>
        <br>
        <br>
        <VRevealText
            v-model="reveal"
            :content="siteName"
            class="text-h1"
            :class="$style.text"
        />
    </div>
</template>

<style lang="scss" module>
.root {
    position: fixed;
    z-index: 1001;
    display: flex;
    height: 100svh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--theme-color-background);
    inset: 0;
}

.text {
    > *[data-char-content] {
        position: relative;
        display: inline-block;
        overflow: hidden;
        color: transparent;
        opacity: 1;
    }

    > *[data-char-content]::after {
        position: absolute;
        color: var(--color-main-darker-80);
        content: attr(data-char-content);
        inset: 0;
        transition: translate 0.3s calc(var(--data-char-index, 1) * 50ms) ease(out-quart);
        translate: 0 110%;
    }

    .root--reveal & *[data-char-content]::after {
        translate: 0 10%;
    }
}
</style>
