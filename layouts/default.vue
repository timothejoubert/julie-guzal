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
    <NuxtPage />
</template>

<style lang="scss" module>
@use 'assets/scss/variables/fonts' as *;

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
