<script  lang="ts" setup>
import gsap from 'gsap'

const isDisplayed = defineModel<boolean>({ default: false })
const cursor = ref<HTMLElement | null>(null)
const direction = ref<'left' | 'right'>('right')
const isLargeScreen = useMediaQuery('(min-width: 1024px)', { ssrWidth: 768 })

let xSetter: null | ReturnType<typeof gsap.quickTo> = null
let ySetter: null | ReturnType<typeof gsap.quickTo> = null

function onMove(event: MouseEvent) {
    if (!xSetter || !ySetter || !cursor.value) return
    direction.value = event.clientX > window.innerWidth / 2 ? 'right' : 'left'

    xSetter(event.clientX - cursor.value.offsetWidth / 2)
    ySetter(event.clientY - cursor.value.offsetHeight / 2)
}

function initSetters() {
    if (!isLargeScreen.value) return
    if (!xSetter) {
        xSetter = gsap.quickTo(cursor.value, 'x', { duration: 0.4, ease: 'power3' })
    }
    if (!ySetter) {
        ySetter = gsap.quickTo(cursor.value, 'y', { duration: 0.4, ease: 'power3' })
    }
}

function killSetters() {
    if (xSetter) {
        xSetter.tween.kill()
        xSetter = null
    }
    if (ySetter) {
        ySetter.tween.kill()
        ySetter = null
    }
}

function setOnCenter() {
    const x = window.innerWidth / 2 - (cursor.value?.offsetWidth || 1) / 2
    const y = window.innerHeight / 2 - (cursor.value?.offsetHeight || 1) / 2
    gsap.to(cursor.value, { x, y, ease: 'back.out', duration: 0.25 })
}

function init() {
    setOnCenter()
    initSetters()
    window.addEventListener('mousemove', onMove)
    isDisplayed.value = true
}

function kill() {
    setOnCenter()
    window.removeEventListener('mousemove', onMove)
    killSetters()
    isDisplayed.value = false
}

watch(isLargeScreen, (isLarge) => {
    if (isLarge) init()
    else kill()
})

onMounted(() => {
    if (!isLargeScreen.value) return
    init()
})

onBeforeUnmount(kill)

// EMITS
defineEmits<{
    onClick: []
}>()
</script>

<template>
    <div
        ref="cursor"
        aria-hidden="true"
        :class="[$style.root, isDisplayed && $style['root--displayed'], $style[`root--direction-${direction}`]]"
    >
        <VIcon
            name="arrow-left"
            :class="$style.icon"
        />
    </div>
</template>

<style lang="scss" module>
.root {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: #cdcdcd;
    border-radius: 100%;
    pointer-events: none;
    opacity: 0;

    &--displayed {
        opacity: 1;
        pointer-events: initial;
        cursor: pointer;
    }
}

.icon {
    transition: rotate 0.4s ease(out-quad);
    transform-origin: center;

    .root--direction-right & {
        rotate: 180deg;
    }
}
</style>
