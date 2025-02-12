<script  lang="ts" setup>
import type { PossibleProjectPageDocument } from '~/types/app'

interface VProjectCardProps {
    project: PossibleProjectPageDocument | null
    skeleton?: boolean
    rootTag?: string
}

const props = defineProps<VProjectCardProps>()

const { image, title, date, tags } = useProjectUtils(props.project)
</script>

<template>
    <component
        :is="rootTag || 'div'"
        :class="[$style.root, skeleton && $style['root--skeleton']]"
    >
        <VPrismicLink
            :to="project"
            :class="$style['media-wrapper']"
            rel="noopener nofollow"
            tabindex="-1"
        >
            <VPrismicImage
                v-if="image"
                :document="image"
                fit="crop"
                ar="684:414"
                width="684"
                height="414"
                :class="$style.image"
                sizes="xs:100vw sm:100vw md:100vw lg:50vw xl:50vw xxl:50vw hq:50vw qhd:50vw"
            />
            <div
                v-else
                :class="[$style.image, $style['image--placeholder']]"
            />
        </VPrismicLink>
        <VPrismicLink
            :to="project"
            :class="$style.title"
            :label="title"
        />
        <div
            v-if="tags.length"
            :class="$style.tags"
        >
            <VTag
                v-for="tag in tags"
                :key="tag"
                :class="$style.tag"
                :label="tag"
            />
        </div>
        <VTime
            v-if="date"
            :date="date"
            :class="$style.date"
        />
    </component>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;
@use 'assets/scss/functions/fluid' as *;
@use 'assets/scss/variables/fonts' as *;
@use 'assets/scss/mixins/include-media' as *;

.root {
    position: relative;
    display: flex;
    flex-wrap: wrap;
}

.media-wrapper {
    display: block;
    width: 100%;
}

.image {
    width: 100%;

    &--placeholder {
        aspect-ratio: 460 / 248;
        background-color: lightgrey;
    }
}

.title {
    display: block;
    color: inherit;
    font-weight: 300;
    font-family: $font-lecturis-family;
    text-decoration: none;
    line-height: 1.4;
    margin-block: rem(14) rem(25);
    font-size: fluid((xs: 24, xl: 30));
    width: 100%;

    @include media('>=lg') {
      margin-block: rem(48) rem(60);
    }
}

.tags {
  font-weight: 300;
  font-family: $font-suisse-family;
  line-height: 1.3;
  font-size: rem(14);
  width: 50%;
}

.date {
  font-weight: 300;
  font-family: $font-suisse-family;
  line-height: 1.3;
  font-size: rem(14);
  width: 50%;
  text-align: right;
    margin-left: auto;
}
</style>
