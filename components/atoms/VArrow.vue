<script lang="ts">
import type { PropType } from 'vue'
import { NuxtLink, VIcon } from '#components'

export const vArrowProps = {
    tag: String,
    size: {
        type: String as PropType<'sm' | 'md' | 'lg' >,
        default: 'md',
    },
    direction: {
        type: String as PropType<'up' | 'down' | 'left' | 'right' >,
        default: 'right',
    },
    href: String,
    to: String,
    border: String,
}

export default defineComponent({
    props: vArrowProps,
    setup(props) {
        const $style = useCssModule()

        const rootTag = computed(() => {
            if (props.tag) return props.tag
            else if (props.href) return 'a'
            else if (props.to) return NuxtLink
            return 'span'
        })

        return () => {
            const attrs = {
                'class': [
                    $style.root,
                    $style[`root--size-${props.size}`],
                ],
                'aria-hidden': rootTag.value === 'button' || rootTag.value === 'a' ? undefined : 'true',
                'href': props.href,
                'to': props.to,
            }
            return h(rootTag.value, attrs,
                h(VIcon, { class: $style.icon, name: `arrow-${props.direction}` }),
            )
        }
    },
})
</script>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;
@use 'assets/scss/mixins/property-fluid' as *;

.root {
    position: relative;
    display: var(--v-arrow-display, inline-flex);
    align-items: var(--v-arrow-align-items, center);
    justify-content: center;
    padding: var(--v-arrow-padding, var(--v-arrow-padding-size));
    border-radius: var(--v-arrow-border, var(--v-arrow-border-size));
    background-color: var(--theme-color-primary);
    color: var(--theme-color-on-primary);

    &--size-sm {
        --v-arrow-border-size: #{rem(5)};
        --v-arrow-padding-size: #{rem(3)};
    }

    &--size-md {
        --v-arrow-border-size: #{rem(6)};
        --v-arrow-padding-size: #{rem(6)};
    }

    &--size-lg {
        --v-arrow-border-size: #{rem(16)};
        --v-arrow-padding-size: #{rem(9)};
    }
}

.icon {
    height: auto;
    transform-origin: center;

    :global(.global--theme-dark) & {
        color: var(--theme-color-background);
    }

    .root--size-sm & {
        @include property-fluid('width', (xs: 18, xl: 26), $breakpoint: null);
    }

    .root--size-md & {
        @include property-fluid('width', (xs: 24, xl: 38), $breakpoint: null);
    }

    .root--size-lg & {
        @include property-fluid('width', (xs: 32, xl: 48), $breakpoint: null);
    }
}
</style>
