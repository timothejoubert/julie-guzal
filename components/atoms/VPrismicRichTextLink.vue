<script  lang="ts" setup>
import type { RTLinkNode } from '@prismicio/types'
import type { RichTextComponentProps } from '@prismicio/vue'

const props = defineProps<RichTextComponentProps<RTLinkNode>>()

const label = computed(() => props.node?.text)
const linkData = computed(() => props.node.data)
const url = computed(() => linkData.value.url)

const mailToContent = computed(() => {
    if (url.value?.startsWith('mailto:')) return url.value.replace('mailto:', '')

    return undefined
})

const { addToast } = useToast()
const { t } = useI18n()

function copyToClipBoard(_event: MouseEvent) {
    if (!mailToContent.value) return

    navigator.clipboard.writeText(mailToContent.value).then(() => {
        addToast({
            id: 'email_clipboard',
            type: 'success',
            message: t('email.copied__success'),
            duration: 2000,
        })
    }).catch((error) => {
        console.log('error', error)
    })
}
</script>

<template>
    <button
        v-if="mailToContent"
        :class="$style['mail-to']"
        @click="copyToClipBoard"
    >
        {{ mailToContent }}
    </button>
    <VPrismicLinkIcon
        v-else
        :to="linkData.url"
        :label="label"
        icon-size="6"
        icon-name="arrow-right-top-xs"
        :class="$style.link"
    />
</template>

<style lang="scss" module>
.mail-to {
    padding: 0;
    border: none;
    margin: 0;
    background-color: initial;
    cursor: pointer;
}

.link {
    @include media('>lg') {
        --cross-nav-arrow-first-opacity: 0;
    }
}
</style>
