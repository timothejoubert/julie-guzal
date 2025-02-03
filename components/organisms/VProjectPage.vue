<script  lang="ts" setup>
import type { ProjectPageDocument } from '~/prismicio-types'
import { useProjectUtils } from '~/composables/use-project-utils'
import VProjectCrossLink from '~/components/organisms/VProjectCrossLink.vue'
import { components } from '~/slices'
import { prismicDocumentRoute } from '~/utils/prismic/route-resolver'

const props = defineProps<{
    document: ProjectPageDocument
}>()

const { image, title, tags, date, content, credits, externalUrl } = useProjectUtils(props.document)

const tagsText = computed(() => tags.value.join(', '))
const slices = computed(() => props.document.data.slices)

const { url: projectListingUrl } = useLinkResolver(prismicDocumentRoute.home_page)
</script>

<template>
    <div>
        <header
            :class="$style.header"
            class="grid"
        >
            <VPrismicLink
                :to="projectListingUrl"
                :class="$style.back"
            >
                <VIcon
                    :class="$style.back__arrow"
                    name="arrow-back"
                />
                {{ $t('back') }}
            </VPrismicLink>
            <VPrismicImage
                v-if="image"
                :document="image"
                fit="crop"
                ar="1440:610"
                width="1440"
                height="610"
                :class="$style.image"
                sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw hq:100vw qhd:100vw"
            />
            <h1 :class="$style.title">
                {{ title }}
            </h1>
            <div :class="$style.tags">
                {{ tagsText }}
            </div>
            <VTime
                :date="date"
                :class="$style.date"
            />
            <VText
                v-if="content"
                :content="content"
                :class="$style.content"
            />
        </header>
        <main :class="$style.main">
            <LazySliceZone
                v-if="slices?.length"
                :slices="slices"
                :components="components"
            />
            <section
                :class="$style.credits"
                class="grid"
            >
                <div :class="$style.credits__title">
                    {{ $t('credits') }}
                </div>
                <VText
                    v-if="credits"
                    :content="credits"
                    :class="$style.credits__content"
                />
                <VPrismicLink
                    v-if="externalUrl"
                    :to="externalUrl"
                    :label="externalUrl"
                    :class="$style['external-link']"
                />
            </section>
        </main>
        <VProjectCrossLink :current="document" />
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;
@use 'assets/scss/functions/fluid' as *;
@use 'assets/scss/variables/fonts' as *;
@use 'assets/scss/mixins/include-media' as *;

$item-margin-top: rem(289);

.root {
}

.header {
    position: relative;
}

.back {
    position: absolute;
    left: 0;
    top: rem(24);
    display: flex;
    align-items: center;
    gap: rem(14);
    font-family: $font-lecturis-family;
    font-size: rem(20);
    line-height: 1.4;
    text-decoration: none;
    z-index: 1;
    color: var(--theme-color-on-background);
}

.image {
    --v-img-max-width: none;

    grid-column: 1 / -1;
    width: calc(100% + var(--gutter) * 2);
    margin-left: calc(var(--gutter) * -1);
}

.title {
    grid-column: 1 / -1;
    font-family: $font-lecturis-family;
    line-height: 1.4;
    font-size: fluid((xs: 50, xl: 100));
    margin-block: rem(32) 0;
    font-weight: 300;

    @include media('>=lg') {
        margin-top: rem(42);
    }
}

.tags {
    grid-column: 1 / -1;
    font-family: $font-suisse-family;
    line-height: 1.3;
    font-size: rem(20);
    margin-top: rem(48);
    font-weight: 400;

    @include media('>=lg') {
        grid-column: 1 / 7;
        margin-top: $item-margin-top;
    }

}

.date {
    position: relative;
    grid-column: 1 / -1;
    font-family: $font-suisse-family;
    line-height: 1.3;
    font-size: rem(20);
    font-weight: 400;
    margin-top: rem(52);
    padding-top: rem(24);

    &::before {
        position: absolute;
        content: '';
        top: 0;
        left: calc(var(--gutter) * -1);
        right: calc(var(--gutter) * -1);
        height: 1px;
        background-color: var(--theme-color-on-background);
    }

    @include media('>=lg') {
        margin-top: $item-margin-top;
        grid-column: 7;
        padding-top: initial;

        &::before {
            display: none;
        }
    }
}

.content {
    grid-column: 1 / -1;
    font-family: $font-suisse-family;
    line-height: 1.27;
    font-size: rem(18);
    font-weight: 300;
    margin-top: rem(24);

    @include media('>=lg') {
        margin-top: $item-margin-top;
        grid-column: 8 / -1;
    }
}

.main {
    margin-top: rem(96);
}

.credits {
    margin-block: rem(56);
}

.credits__title {
    grid-column: 1 / -1;
    font-family: $font-suisse-family;
    line-height: 1.3;
    font-size: rem(24);
    font-weight: 400;

    @include media('>=lg') {
        grid-column: 1 / 7;
    }
}

.credits__content {
    grid-column: 1 / -1;
    font-family: $font-suisse-family;
    line-height: 1.42;
    font-size: rem(14);
    font-weight: 300;
    margin-top: rem(34);

    @include media('>=lg') {
        margin-top: initial;
        grid-column: 7 / -1;
    }
}

.external-link {
    grid-column: 1 / -1;
    font-family: $font-suisse-family;
    line-height: 1.3;
    font-size: rem(24);
    font-weight: 400;
    margin-top: rem(34);
    text-decoration: none;
    color: var(--theme-color-on-background);

    @include media('>=lg') {
        margin-top: rem(44);
        grid-column: 7 / -1;
    }
}
</style>
