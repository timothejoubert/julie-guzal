<script  lang="ts" setup>
import { useTopBarScroll } from '~/composables/use-top-bar-scroll'
import type { ReachableDocument } from '~/types/api'

const props = defineProps<{
    document?: ReachableDocument
}>()

defineOptions({
    inheritAttrs: false,
})

const settings = await usePrismicSettingsDocument()
const description = settings?.data?.site_description

const currentPage = useCurrentPage()
const _document = computed(() => props.document || currentPage.value.webResponse)
const pageTitle = computed(() => _document.value?.data?.title)
const pageTitleMobile = computed(() => (_document.value?.data as { title_mobile?: string | null })?.title_mobile)

const isProject = computed(() => _document.value?.type === 'project_page')

const { isHidden, isOnPageTop } = useTopBarScroll()

const $style = useCssModule()
const rootClasses = computed(() => {
    return [$style.root,
        isHidden.value && $style['root--hidden'],
        isOnPageTop.value && $style['root--on-page-top'],
    ]
})
</script>

<template>
    <div
        v-if="!isProject"
        :class="[rootClasses, $attrs.class]"
        class="grid"
    >
        <h1 :class="$style.title">
            <template v-if="pageTitleMobile">
                <span :class="$style['title-desktop']">{{ pageTitle }}</span>
                <span
                    v-if="pageTitleMobile"
                    :class="$style['title-mobile']"
                >{{ pageTitleMobile }}</span>
            </template>
            <template v-else>
                {{ pageTitle }}
            </template>
        </h1>
        <VNav
            :class="$style.nav"
        />
    </div>
    <VText
        v-if="description"
        :content="description"
        tag="h2"
        :class="$style.content"
    />
</template>

<style lang="scss" module>
@use 'assets/scss/functions/flex-grid' as *;
@use 'assets/scss/functions/fluid' as *;
@use 'assets/scss/variables/fonts' as *;

$padding-top: rem(24);
$padding-bottom: rem(24);

.root {

    padding-block: $padding-top $padding-bottom;
    z-index: 99;

    @include media('>=md') {
        position: sticky;
        top: 0;
    }
}

.title {
    // line-height: 0.69; // Compensate font box sizing

    max-width: var(--v-top-bar-title-max-width);
    font-family: $font-lecturis-family;
    font-size: fluid((xs: 100, xl: 100));
    font-weight: 300;
    grid-column: 1 / -1;
    line-height: 1;
    margin-block: initial;
    text-transform: uppercase;
    translate: 0 -0.14lh;

    @include media('>=md') {
        grid-column: 1 / span 9;
        transition: translate 0.5s ease(out-quad);

        .root--hidden & {
            translate: 0 calc(-100% - #{rem(24)});
        }
    }

    @include media('>=lg') {
        grid-column: 1 / span 6;
    }
}

.title-mobile {
    display: block;

    @include media('>=md') {
        display: none;
    }
}

.title-desktop {
    display: none;

    @include media('>=md') {
        display: block;
    }
}

.nav {
    grid-column: 1 / -1;
    transition: translate 0.5s ease(out-quad);

    .root--hidden & {
        translate: 0 calc(100% + #{rem(24)});
    }

    @include media('>=md') {
        grid-column: 10 / -1;

        .root--hidden & {
            translate: 0 calc(-100% - #{rem(24)});
        }
    }

    @include media('>=lg') {
        grid-column: 7 / span 1;
    }
}

.content {
    max-width: 20ch;
    margin-top: rem(68);
    font-family: $font-suisse-family;
    font-size: rem(20);
    font-weight: 400;
    grid-column: 1 / -1;
    margin-left: var(--gutter);
    line-height: 1.3;
    margin-block: rem(68 - 24) 0;

    @include media('>=md') {
        grid-column: 1 / span 5;
        transition: translate 0.5s ease(out-quad), opacity 0.3s ease(out-quad);
        .root:not(.root--on-page-top) & {
            opacity: 0;
            pointer-events: none;
            translate: 0 calc(-100% - #{rem(24)});
        }
    }

    @include media('>=lg') {
        font-size: rem(14);
        position: absolute;
        left: calc(#{flex-grid-value(8, 12)} + var(--gutter));
        top: $padding-top;
        width: flex-grid(2, 12, '%', true);
        margin-top: initial;
        grid-column: 10 / span 2;
    }
}
</style>
