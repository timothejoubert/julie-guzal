<script  lang="ts" setup>
import ScssGrid from 'assets/scss/export/_grid.module.scss'

const maxColumnLength = Math.max(...Object.values(ScssGrid).map(v => Number(v)))

const isVisible = ref(false)

const isValidKeyDown = (e: KeyboardEvent) => {
    return e.shiftKey && (e.key === 'g' || e.key === 'G')
}

useEventListener('keydown', (e) => {
    if (isValidKeyDown(e)) isVisible.value = !isVisible.value
})
</script>

<template>
    <ul
        v-show="isVisible"
        :class="$style.root"
        class="grid"
        aria-hidden="true"
    >
        <li
            v-for="index in maxColumnLength"
            :key="index"
            :class="$style.item"
        />
    </ul>
</template>

<style lang="scss" module>
.root {
    position: fixed;
    z-index: 1001;
    top: 0;
    bottom: 0;
    left: var(--gutter);
    grid-template-rows: 1fr;
    margin-block: initial;
    pointer-events: none;
}

.item {
    background-color: rgba(255, 0, 0, 10%);
    list-style: none;
}
</style>
