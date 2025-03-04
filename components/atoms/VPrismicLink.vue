<script lang="ts">
import { h, type PropType } from 'vue'
import type { NuxtLinkProps } from '#app/components/nuxt-link'
import { NuxtLink } from '#components'
import { type PossibleRouteReference, useLinkResolver } from '~/composables/use-link-resolver'

export const vPrismicLinkProps = {
    to: [Object, String] as PropType<PossibleRouteReference>,
    nuxtLinkProps: Object as PropType<NuxtLinkProps>,
    custom: Boolean, // use scoped slot
    label: [String, null],
    fallbackTag: String,
}

export default defineComponent({
    inheritAttrs: false,
    props: vPrismicLinkProps,
    setup(props, { attrs, slots }) {
        const { isRelative, isExternal, url } = useLinkResolver(props.to)

        const attributes = computed(() => {
            const result = { ...attrs, ...props.nuxtLinkProps }

            if (isRelative.value) {
                Object.assign(result, { to: url })
            }
            else if (isExternal) {
                Object.assign(result, {
                    target: attrs?.target || '_blank',
                    rel: attrs?.rel || 'noopener noreferrer',
                    href: url.value,
                })
            }

            return result
        })

        return () => {
            if (props.custom) {
                return slots.default?.({ ...attributes.value, url: attributes.value.href || attributes.value.to })
            }

            const child = slots.default || (() => (typeof props.label === 'string' && props.label))

            if (!url.value) {
                return h(props.fallbackTag || 'div', { class: attrs.class }, child)
            }

            return h(NuxtLink, attributes.value, child)
        }
    },
})
</script>
