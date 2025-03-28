<script lang="ts">
import pick from 'lodash/pick'
import { vPrismicLinkProps } from '~/components/atoms/VPrismicLink.vue'
import { VIcon, VPrismicLink } from '#components'

export const vPrismicLinkIconProps = {
    ...vPrismicLinkProps,
    iconName: {
        type: String,
        default: 'arrow-right-top',
    },
    iconSize: {
        type: String,
        default: '24',
    },
    iconDirection: {
        type: String as PropType<'top-right' | 'bottom-right'>,
        default: 'top-right',
    },
    iconClass: String,
}

export default defineComponent({
    props: vPrismicLinkIconProps,
    setup(props) {
        const linkProps = computed(() => pick(props, Object.keys(vPrismicLinkProps)))

        const iconProps = computed(() => {
            return {
                name: props.iconName,
                width: props.iconSize,
                height: props.iconSize,
            }
        })

        const $style = useCssModule()
        return () => {
            return h(VPrismicLink, { ...linkProps.value, class: $style.root },
                {
                    default: () => [
                        h('span', { class: $style.label }, props.label || ''),
                        h('span', { class: [props.iconClass, $style.icons, $style[`icons--direction-${props.iconDirection}`]] }, [
                            h(VIcon, { ...iconProps.value, class: [$style['icon'], $style['icon--first']] }),
                            h(VIcon, { ...iconProps.value, class: [$style['icon'], $style['icon--second']] }),
                        ]),
                    ],
                },
            )
        }
    },
})
</script>

<style lang="scss" module>
.root {
    position: relative;
    color: inherit;
    text-decoration: none;
}

.label {
    margin-right: var(--v-prismic-link-icon-label-margin-right, rem(4));
}

$icons-spacing: 3px;

.icons {
    position: relative;
    display: inline-flex;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    padding: $icons-spacing;
    transform-origin: center;

    &--direction-bottom-right {
        rotate: 90deg;
    }
}

.icon {
    color: inherit;
    transition-duration: 0.35s;
    transition-property: translate, opacity;
    transition-timing-function: ease(out-quart);

    &--first {
        opacity: var(--cross-nav-arrow-first-opacity);
    }

    &--second {
        position: absolute;
        top: calc(100% + $icons-spacing);
        left: calc(-100% + $icons-spacing);
    }

    @media (hover: hover) {
        .root:hover & {
            translate: calc(100% + $icons-spacing * 2) calc(-100% - $icons-spacing * 2);

            &--second {
                color: var(--v-prismic-link-icon-secondary-color, var(--theme-color-primary));
            }
        }
    }
}
</style>
