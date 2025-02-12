<script  lang="ts" setup>
import { asText } from '@prismicio/helpers'
import type { ProjectPageDocument } from '~/prismicio-types'
import { useProjectUtils } from '~/composables/use-project-utils'
import VProjectCrossLink from '~/components/organisms/VProjectCrossLink.vue'
import { components } from '~/slices'
import { prismicDocumentRoute } from '~/utils/prismic/route-resolver'

const props = defineProps<{
    document: ProjectPageDocument
}>()

const { image, title, tags, date, content, credits, externalUrl, externalUrlLabel } = useProjectUtils(props.document)

const tagsText = computed(() => tags.value.join(', '))
const slices = computed(() => props.document.data.slices)

const hasCredits = computed(() => {
    return !!(asText(credits.value) || externalUrl.value || externalUrlLabel.value)
})

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
                v-if="hasCredits"
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
                    :label="externalUrlLabel || $t('project_page.external_link_label')"
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

.header {
    position: relative;
}

.back {
    position: absolute;
    z-index: 1;
    top: rem(24);
    left: 0;
    display: flex;
    align-items: center;
    color: var(--theme-color-on-background);
    font-family: $font-lecturis-family;
    font-size: rem(20);
    gap: rem(14);
    line-height: 1.4;
    text-decoration: none;
}

.image {
    --v-img-max-width: none;

    width: calc(100% + var(--gutter) * 2);
    margin-left: calc(var(--gutter) * -1);
    grid-column: 1 / -1;
}

.title {
    font-family: $font-lecturis-family;
    font-size: fluid((xs: 50, xl: 100));
    font-weight: 300;
    grid-column: 1 / -1;
    line-height: 1.4;
    margin-block: rem(32) 0;

    @include media('>=lg') {
        margin-top: rem(42);
    }
}

.tags {
    margin-top: rem(48);
    font-family: $font-suisse-family;
    font-size: rem(20);
    font-weight: 400;
    grid-column: 1 / -1;
    line-height: 1.3;

    @include media('>=lg') {
        margin-top: $item-margin-top;
        grid-column: 1 / 7;
    }
}

.date {
    position: relative;
    padding-top: rem(24);
    margin-top: rem(52);
    font-family: $font-suisse-family;
    font-size: rem(20);
    font-weight: 400;
    grid-column: 1 / -1;
    line-height: 1.3;

    &::before {
        position: absolute;
        top: 0;
        right: calc(var(--gutter) * -1);
        left: calc(var(--gutter) * -1);
        height: 1px;
        background-color: var(--theme-color-on-background);
        content: '';
    }

    @include media('>=lg') {
        padding-top: initial;
        margin-top: $item-margin-top;
        grid-column: 7;

        &::before {
            display: none;
        }
    }
}

.content {
    margin-top: rem(24);
    font-family: $font-suisse-family;
    font-size: rem(18);
    font-weight: 300;
    grid-column: 1 / -1;
    line-height: 1.27;

    & > h4:first-child {
        font-size: rem(20);
    }

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
    font-family: $font-suisse-family;
    font-size: rem(24);
    font-weight: 400;
    grid-column: 1 / -1;
    line-height: 1.3;

    @include media('>=lg') {
        grid-column: 1 / 7;
    }
}

.credits__content {
    margin-top: rem(34);
    font-family: $font-suisse-family;
    font-size: rem(16);
    font-weight: 300;
    grid-column: 1 / -1;
    line-height: 1.42;

    @include media('>=lg') {
        margin-top: initial;
        grid-column: 7 / -1;
    }
}

.external-link {
    margin-top: rem(34);
    color: var(--theme-color-on-background);
    font-family: $font-suisse-family;
    font-size: rem(24);
    font-weight: 400;
    grid-column: 1 / -1;
    line-height: 1.3;
    text-decoration: none;

    @include media('>=lg') {
        margin-top: rem(44);
        grid-column: 7 / -1;
    }
}
</style>
