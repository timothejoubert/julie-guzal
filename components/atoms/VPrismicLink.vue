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

        // Define attributes
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

        // warning_bug(Vue): Seem to have wrong vue warning "Slot invoked outside of the render function"
        // https://github.com/vuejs/core/issues/12194
        return () => {
            // Custom VRoadizLink will pass all attributes to the default slot
            // and render it (i.e. render-less component behavior)
            if (props.custom) {
                return slots.default?.({ ...attributes.value, url: attributes.value.href || attributes.value.to }) || ''
            }
            else if (url.value) {
                return h(NuxtLink, attributes.value, slots.default || (() => (typeof props.label === 'string' && props.label) || ''))
            }

            const child = (slots.default && slots.default()) || (typeof props.label === 'string' && h('span', attrs, props.label)) || ''

            return props.fallbackTag
                ? h(props.fallbackTag, { class: attrs.class }, child)
                : child
        }
    },
})
</script>
