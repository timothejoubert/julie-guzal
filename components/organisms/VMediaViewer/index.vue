<script lang="ts" setup>
import { getHtmlElement, type TemplateElement } from '~/utils/ref/get-html-element'

const mediaViewerInstance = ref<TemplateElement>(null)
const mediaViewer = ref<HTMLElement | null>(null)
const { isOpen } = useMediaViewer()

const unwatch = watch(mediaViewerInstance, (componentInstance) => {
    if (!componentInstance || mediaViewer.value) return

    mediaViewer.value = getHtmlElement(componentInstance) as HTMLElement

    // During first time apparition, element is set after isOpen watch method callback
    if (isOpen.value) disableScroll()
    unwatch()
})

watch(
    isOpen,
    (isOpen) => {
        if (isOpen) disableScroll()
        else enabledScroll()
    },
    { flush: 'post' },
)

const documentElement = ref<HTMLElement | null>(null)
onMounted(() => documentElement.value = document.body)
const isLocked = useScrollLock(documentElement)

function disableScroll() {
    isLocked.value = true
}

function enabledScroll() {
    isLocked.value = false
}
</script>

<template>
    <Transition
        :name="$style['root']"
        @after-leave="enabledScroll"
    >
        <LazyVMediaViewerContent
            v-if="isOpen"
            ref="mediaViewerInstance"
        />
    </Transition>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/ease' as *;

.root {
    &:global(#{'-enter-active'}),
    &:global(#{'-leave-active'}) {
        transition-duration: 0.3s, 0.5s;
        transition-property: opacity, scale;
        transition-timing-function: ease(out-quad), ease(out-quart);
    }

    &:global(#{'-enter-from'}),
    &:global(#{'-leave-to'}) {
        opacity: 0;
        scale: 0.98;
    }
}
</style>
