<script lang="ts">
import type { ExtractPropTypes } from 'vue'
import { objectPick } from '@vueuse/core'
import { imgProps, pictureProps } from '~/utils/image/nuxt-image-props'
import VImg from '~/components/atoms/VImg.vue'
import VPictureSource from '~/components/atoms/VPicture/VPictureSource.vue'

export const vPictureProps = {
    ...pictureProps,
    placeholder: imgProps.placeholder,
}

export type VPictureProps = ExtractPropTypes<typeof vPictureProps>

export default defineComponent({
    props: {
        ...vPictureProps,
    },
    setup(props, context) {
        // Provide props to children (<sources>)
        provide('pictureProps', props)

        const $style = useCssModule()
        const imgFilteredProps = computed(() => objectPick(props, Object.keys(imgProps) as Array<keyof typeof props>))

        return () =>
            h('picture', { class: $style.root }, [
                context.slots.default?.() || h(VPictureSource),
                h(VImg, {
                    ...imgFilteredProps.value,
                    ...props.imgAttrs,
                }),
            ])
    },
})
</script>

<style lang="scss" module>
.root {
    display: var(--v-picture-display, fit-content);
}
</style>
