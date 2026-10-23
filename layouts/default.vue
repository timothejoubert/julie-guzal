<script  lang="ts" setup>
import { getDocumentTypeByUrl } from '~/utils/prismic/route-resolver'
import type { ReachableDocument } from '~/types/api'

const route = useRoute()
const isWildCardPage = route.matched?.find(match => match.path === '/:uid(.*)*')

if (isWildCardPage) {
    // Set current page for component data outside pages
    const pageType = getDocumentTypeByUrl(route.path)

    const { webResponse } = await usePrismicFetchPage<ReachableDocument>(pageType)
    if (webResponse) useCurrentPage().value = { webResponse }
}

const appConfig = useAppConfig()

// Mobile main nav: rendered here, outside the pages, so page transitions (transforms) never move it or cover it.
// On desktop each page renders it in its top bar.
const navPageType = computed(() => getDocumentTypeByUrl(route.path))
const isNavVisible = computed(() => navPageType.value !== 'project_page')
const navTheme = computed(() => (navPageType.value === 'home_page' ? 'light' : 'dark'))
const { isHidden: isTopBarHidden } = useTopBarState()
</script>

<template>
    <a
        href="#main-content"
        :class="$style['skip-link']"
    >{{ $t('skip_link') }}</a>
    <NuxtRouteAnnouncer />
    <ClientOnly>
        <VGridVisualizer />
        <VMediaViewer />
        <VToast />
        <VLoadingIndicator />
    </ClientOnly>

    <LazyVSplashScreen v-if="appConfig.featureFlags.splashScreen" />
    <VNav
        :theme="navTheme"
        :inert="!isNavVisible"
        :class="[$style.nav, (!isNavVisible || isTopBarHidden) && $style['nav--hidden']]"
    />
    <NuxtPage />
</template>

<style lang="scss" module>
@use 'assets/scss/variables/fonts' as *;

// Above the pages and their transitions, below the media viewer (101)
.nav {
    z-index: 100;
    transition: translate 0.5s ease(out-quad);

    &--hidden {
        pointer-events: none;
        translate: 0 calc(100% + #{rem(24)});
    }

    @include media('>=md') {
        display: none;
    }
}

// Visually hidden until focused (RGAA 12.7)
.skip-link {
    position: fixed;
    z-index: 1000;
    top: rem(8);
    left: rem(8);
    padding: rem(12) rem(16);
    border-radius: rem(4);
    background-color: var(--theme-color-background);
    color: var(--theme-color-on-background);
    font-family: $font-suisse-family;
    font-size: rem(16);
    font-weight: 400;
    line-height: 1.3;
    text-decoration: none;

    &:not(:focus) {
        overflow: hidden;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        clip-path: inset(50%);
        white-space: nowrap;
    }
}
</style>
