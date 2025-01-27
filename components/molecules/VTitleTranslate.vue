<script  lang="ts">
export default defineComponent({
    props: {
        tag: String,
        title: [String, null],
        active: Boolean,
    },
    setup(props) {
        const tag = props.tag || 'div'
        const $style = useCssModule()

        const root = ref<HTMLElement | null>(null)
        const renderClientChildren = ref(false)
        let intersectionObs: null | IntersectionObserver = null

        const unwatch = watch(root, (element) => {
            if (!element) return
            intersectionObs = new IntersectionObserver(([entries]) => {
                if (entries.isIntersecting) {
                    renderClientChildren.value = true
                    clearIntersectionObs()
                }
            })
            intersectionObs.observe(element)
            unwatch()
        })

        function clearIntersectionObs() {
            intersectionObs?.disconnect()
            intersectionObs = null
        }

        onBeforeUnmount(clearIntersectionObs)

        const title = computed(() => props.title || '')
        const mountedNode = h('span', { class: $style.item }, title.value)

        const childrenNode = computed(() => {
            return renderClientChildren.value ? h('div', { class: $style.wrapper }, [mountedNode, mountedNode, mountedNode]) : title.value
        })

        const enterDirection = ref('top')

        function onMouseEnter(event: MouseEvent) {
            const el = event.target as HTMLElement
            if (!el) return
            const elCenter = el.getBoundingClientRect().top + el.getBoundingClientRect().height / 2

            enterDirection.value = event.clientY > elCenter ? 'bottom' : 'top'
        }

        return () => h(tag, {
            ref: root,
            onMouseenter: onMouseEnter,
            onMouseleave: onMouseEnter,
            class: [
                $style.root,
                renderClientChildren.value && $style['root--render-client-children'],
                renderClientChildren.value && $style[`root--translate-direction-${enterDirection.value}`],
                renderClientChildren.value && props.active && $style['root--active'],
            ],
        }, childrenNode.value)
    },
})
</script>

<template>
    <component
        :is="tag || 'div'"
        :class="$style.root"
    >
        <span>{{ title }}</span>
    </component>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/ease' as *;

.root {
    position: relative;

    &--render-client-children {
        overflow: hidden;
    }
}

.wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    transition: translate 0.3s ease(out-quad);

    .root--translate-direction-top:not(.root--active) & {
        translate: 0 -100%;
    }

    .root--translate-direction-bottom:not(.root--active) & {
        translate: 0 100%;
    }

    .root--active & {
        translate: 0 0;
    }
}

.item {
    &:first-child,
    &:last-child {
        position: absolute;
    }

    &:first-child {
        translate: 0 -100%;
    }

    &:last-child {
        translate: 0 100%;
    }
}
</style>
