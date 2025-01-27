<script lang="ts">
import { type Component, h, type PropType } from 'vue'
import { type VPrismicVideo, type VPrismicImage, LazyVPrismicVideo, LazyVPrismicImage } from '#components'
import type { PossibleMedia } from '~/composables/use-prismic-media'

type VVideoProps = InstanceType<typeof VPrismicVideo>['$props']
type VImageProps = InstanceType<typeof VPrismicImage>['$props']

export default defineComponent({
    props: {
        document: { type: Object as PropType<PossibleMedia>, required: true },
        image: Object as PropType<VImageProps>,
        video: Object as PropType<Omit<VVideoProps, 'document'>>,
    },
    setup(props, { slots }) {
        const { mediaType } = usePrismicMedia(props.document)

        // Node data
        const tag = computed(() => {
            if (mediaType.value === 'video' || mediaType.value === 'embed_video' || mediaType.value === 'public_video') {
                return LazyVPrismicVideo
            }
            else if (mediaType.value === 'image' || mediaType.value === 'public_image') {
                return LazyVPrismicImage
            }
            else if (mediaType.value === 'audio') {
                return 'div'
            }

            return 'div'
        })

        const nodeProps = computed(() => {
            const result = { document: props.document }

            if (mediaType.value === 'video') {
                Object.assign(result, { ...props.video, thumbnailProps: props.image })
            }
            else if (mediaType.value === 'image') {
                Object.assign(result, props.image)
            }

            return result
        })

        return () => h(tag.value as Component | string, nodeProps.value, slots)
    },
})
</script>
