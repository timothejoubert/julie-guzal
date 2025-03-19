<script  lang="ts" setup>
import { useTemplateRefElement } from '~/composables/use-template-element'

const props = defineProps<{
    label: string
    rootTag?: string
}>()

const ALPHABET = 'ABCDEFGHIKLMNOPQRSTVXYZ'
// const PUNCTUATION = `( ) [ ] { } ⟨ ⟩ : , ‒ … ! ‹ › « » " " ? ; / & * @ \\ • # % + ‰ ¶ § ~ _ † ' `

const innerTextElement = useTemplateRefElement('root')

function getRandomCharacters(chars = ALPHABET) {
    let text = ''
    const list = chars.split('')

    for (let i = 0; i < props.label.length; i++) {
        const value = list[Math.ceil(Math.random() * list.length - 1)]
        text += value
    }

    return text
}

let intervalIndex = 0
const { pause } = useIntervalFn(() => {
    if (!innerTextElement.value) {
        pause()
    }
    else if (intervalIndex > 8) {
        pause()
        innerTextElement.value.innerText = props.label
    }
    else {
        innerTextElement.value.innerText = getRandomCharacters()
        intervalIndex++
    }
}, 50)
</script>

<template>
    <component
        :is="rootTag || 'div'"
        ref="root"
    >
        {{ label }}
    </component>
</template>
