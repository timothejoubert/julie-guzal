<script  lang="ts" setup>
const props = defineProps<{
    label: string
    rootTag?: string
}>()

const ALPHABET = 'A B C D E F G H I K L M N O P Q R S T V X Y Z'
// const PUNCTUATION = `( ) [ ] { } ⟨ ⟩ : , ‒ … ! ‹ › « » " " ? ; / & * @ \\ • # % + ‰ ¶ § ~ _ † ' `

const innerTextElement = ref<HTMLElement>()
const REPEAT = 8
const INTERVAL = 50

function getRandomCharacters() {
    let text = ''
    const list = ALPHABET.split(' ')
    const length = props.label.length

    for (let i = 0; i < length; i++) {
        text += list[Math.ceil(Math.random() * list.length - 1)]
    }

    return text
}

let intervalId: null | ReturnType<typeof setInterval> = null
const intervalIndex = ref(0)

function setInnerText(text: string) {
    if (!innerTextElement.value) return

    innerTextElement.value.innerText = text
}

function intervalCallback() {
    if (intervalId && intervalIndex.value > REPEAT) {
        onIntervalEnd()
    }
    else {
        setInnerText(getRandomCharacters())
        intervalIndex.value++
    }
}

function onIntervalEnd() {
    if (!intervalId) return

    clearInterval(intervalId)
    intervalId = null
    intervalIndex.value = 0
    setInnerText(props.label)
}

function setAnimationInterval() {
    if (intervalId) return

    intervalId = setInterval(intervalCallback, INTERVAL)
}

function onClick() {
    if (!intervalId) setAnimationInterval()
}
</script>

<template>
    <component
        :is="rootTag || 'div'"
        :class="$style.root"
        @click="onClick"
    >
        <span ref="innerTextElement">{{ label }}</span>
        <!--        <div -->
        <!--            :class="$style.shapes" -->
        <!--            aria-hidden="true" -->
        <!--        > -->
        <!--            <div -->
        <!--                v-for="shape in 320" -->
        <!--                :key="shape" -->
        <!--                :class="$style.shape" -->
        <!--            /> -->
        <!--        </div> -->
    </component>
</template>

<style lang="scss" module>
.root {
    --v-pixelated-text-width-final: var(--v-pixelated-text-width, 10px);

    position: relative;
    display: inline;
}

.shapes {
    position: absolute;
    z-index: 1;
    //display: grid;
    display: none;
    overflow: hidden;
    gap: calc(var(--v-pixelated-text-width-final) * 2);
    grid-template-columns: repeat(auto-fit, minmax(0, var(--v-pixelated-text-width-final)));
    grid-template-rows: repeat(auto-fill, var(--v-pixelated-text-width-final));
    inset: 20% 0;
}

.shape {
    display: block;
    width: var(--v-pixelated-text-width-final);
    aspect-ratio: 1;
    background-color: var(--theme-color-on-background);
}
</style>
