<script  lang="ts" setup>
import type { KeyTextField } from '@prismicio/types'
import { useLinkResolver } from '~/composables/use-link-resolver'
import type { PossibleRouteReference } from '~/composables/use-link-resolver'

const props = defineProps<{
    title?: string | null
    linkLabel?: string | KeyTextField
    linkReference?: PossibleRouteReference
}>()

const { url: linkUrl } = useLinkResolver(props.linkReference)
</script>

<template>
    <header :class="$style.root">
        <h2
            :class="$style.title"
            class="text-over-title-sm"
        >
            {{ title }}
        </h2>
        <slot />
        <VPrismicLink
            v-if="linkUrl || linkLabel"
            v-slot="{ url }"
            :to="linkUrl"
            custom
        >
            <NuxtLink
                :to="url"
                :class="$style.link"
                class="text-over-title-sm"
            >
                {{ linkLabel }}
                <SvgIcon
                    aria-hidden="true"
                    name="link-arrow"
                    width="21"
                    height="12"
                />
            </NuxtLink>
        </VPrismicLink>
    </header>
</template>

<style lang="scss" module>
@use 'assets/scss/variables/fonts' as *;
@use 'assets/scss/mixins/include-media' as *;
@use 'assets/scss/functions/rem' as *;
@use 'assets/scss/functions/flex-grid' as *;

.root {
    position: relative;
    display: flex;
    align-items: center;

    &::before,
    &::after {
        position: absolute;
        left: calc(var(--gutter) * -1);
        width: calc(100% + var(--gutter) * 2);
        height: 1px;
        background-color: var(--theme-color-line);
        content: '';
    }

    &::before {
        top: 0;
    }

    &::after {
        bottom: 0;
    }
}

.title {
    --over-title-padding-inline: 0;

    font-weight: 600;
    margin-block: 0;
    padding-block: var(--spacing-over-title-padding-block);
}

.link {
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid var(--theme-color-line);
    border-left: 1px solid var(--theme-color-line);
    margin-left: auto;
    gap: rem(10);
    padding-block: var(--spacing-over-title-padding-block);
    padding-inline: var(--gutter);
    text-decoration: none;

    @at-root span#{&} {
        opacity: 0.6;
    }

    @include media('>=lg') {
        min-width: calc(#{flex-grid-value(3, 14)} + var(--gutter));
    }
}
</style>
