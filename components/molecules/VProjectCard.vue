<script  lang="ts" setup>
import type { PossibleProjectPageDocument } from '~/types/app'

interface VProjectCardProps {
    project: PossibleProjectPageDocument | null
    skeleton?: boolean
    rootTag?: string
}

const DISPLAY_DATE = false
const props = defineProps<VProjectCardProps>()

const { image, title, date, tags } = useProjectUtils(props.project)
</script>

<template>
    <component
        :is="rootTag || 'div'"
        :class="[$style.root, skeleton && $style['root--skeleton']]"
    >
        <VPrismicLink
            :to="props.project"
            :class="$style['media-wrapper']"
            rel="noopener nofollow"
            tabindex="-1"
        >
            <VPrismicImage
                v-if="image"
                :document="image"
                fit="crop"
                ar="460:248"
                width="460"
                height="248"
                :class="$style.image"
                sizes="xs:92vw sm:92vw md:32vw lg:32vw xl:32vw xxl:32vw hq:32vw qhd:32vw"
            />
            <div
                v-else
                :class="[$style.image, $style['image--placeholder']]"
            />
        </VPrismicLink>
        <div :class="$style.footer">
            <VPrismicLink
                :to="props.project"
                :class="$style.title"
                :label="title"
                class="text-over-title-md"
            />
            <VTime
                v-if="DISPLAY_DATE && date"
                :date="date"
            />
            <template v-if="tags.length">
                <VTag
                    v-for="tag in tags"
                    :key="tag"
                    :class="$style.tag"
                    :label="tag"
                />
            </template>
        </div>
    </component>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;

.root {
    position: relative;
    display: block;
}

.image {
    width: 100%;

    &--placeholder {
        aspect-ratio: 460 / 248;
        background-color: lightgrey;
    }
}

.footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding-top: rem(10);
    gap: rem(12);

    .root--skeleton & {
        height: rem(24);
        background-color: lightgrey;
    }
}

.title {
    display: block;
    color: inherit;
    font-weight: 800;
    text-decoration: none;
}
</style>
