<script lang="ts">
import type { ExtractPropTypes } from 'vue'
import pick from 'lodash/pick'
import { imgProps, pictureProps } from '#image/components/_base'
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
        const imgFilteredProps = computed(() => pick(props, Object.keys(imgProps)))

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
