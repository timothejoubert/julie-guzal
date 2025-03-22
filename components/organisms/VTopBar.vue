<script  lang="ts" setup>
import { useTopBarScroll } from '~/composables/use-top-bar-scroll'
import type { ReachableDocument } from '~/types/api'
import { useWebsiteReveal } from '~/composables/use-website-reveal'

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
        _document.value?.type === 'contact_page' && $style['root--contact-page'],
        isHidden.value && $style['root--hidden'],
        isOnPageTop.value && $style['root--on-page-top'],
    ]
})

// Reveal
const { firstReveal } = useWebsiteReveal()
</script>

<template>
    <div
        v-if="!isProject"
        :class="[rootClasses, $attrs.class]"
        class="grid"
    >
        <VTextReveal
            v-if="pageTitleMobile"
            :reveal="firstReveal"
            tag="div"
            aria-hidden="true"
            :class="[$style.title, $style['title-mobile']]"
            :content="pageTitleMobile"
        />
        <VTextReveal
            :reveal="firstReveal"
            tag="h1"
            :class="[$style.title, pageTitleMobile && $style['title-desktop']]"
            :content="pageTitle"
        />
        <VNav
            :class="$style.nav"
        />
    </div>
    <VText
        v-if="description"
        ref="textElement"
        :content="description"
        tag="h2"
        class="element-translate"
        :class="[$style.content, firstReveal && 'element-translate--reveal']"
    />
</template>

<style lang="scss" module>
@use 'assets/scss/functions/flex-grid' as *;
@use 'assets/scss/functions/fluid' as *;
@use 'assets/scss/variables/fonts' as *;

$padding-top: rem(24);
$padding-bottom: rem(24);

.root {
    z-index: 99;
    padding-block: $padding-top $padding-bottom;

    @include media('>=md') {
        position: sticky;
        top: 0;
    }
}

.title {
    // line-height: 0.69; // Compensate font box sizing

    max-width: var(--v-top-bar-title-max-width);
    font-family: $font-lecturis-family;
    font-size: rem(100);
    font-weight: 300;
    grid-column: 1 / -1;
    line-height: 1;
    margin-block: initial;
    text-align: center;
    text-transform: uppercase;
    translate: 0 -0.14lh;

    .root--contact-page & {
        font-size: fluid((xs: 70, xl: 100));
    }

    @include media('<md') {
        .root:not(.root--contact-page) & {
            justify-content: center;
        }
    }

    @include media('>=md') {
        grid-column: 1 / span 8;
        text-align: initial;
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
    display: flex;

    @include media('>=md') {
        display: none;
    }
}

.title-desktop {
    display: none;

    @include media('>=md') {
        display: flex;
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
    margin-left: var(--gutter);
    font-family: $font-suisse-family;
    font-size: rem(20);
    font-weight: 400;
    grid-column: 1 / -1;
    line-height: 1.3;
    margin-block: rem(18) rem(40);

    @include media('<md') {
        .root:not(.root--contact-page) + & {
            display: none;
        }
    }

    @include media('>=md') {
        grid-column: 1 / span 5;
    }

    @include media('>=lg') {
        position: absolute;
        top: $padding-top;
        left: calc(#{flex-grid-value(9, 12)} + var(--gutter) * 0.5);
        width: flex-grid(2, 12, '%', true);
        margin-top: initial;
        margin-left: initial;
        font-size: rem(14);
        grid-column: 10 / span 2;
        margin-block: initial;
    }
}
</style>
