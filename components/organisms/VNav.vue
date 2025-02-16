<script lang="ts" setup>
const menu = await usePrismicMenuDocument()

const links = menu.value?.data.links || []

const props = defineProps<{
    theme?: 'light' | 'dark'
}>()

const $style = useCssModule()
const rootClasses = computed(() => {
    return [
        $style.root,
        props.theme && $style[`root--theme-${props.theme}`],
        'v-nav',
    ]
})
</script>

<template>
    <nav
        aria-label="Main"
        :class="rootClasses"
    >
        <ul
            v-if="links.length"
            :class="$style.list"
        >
            <li
                v-for="(link, i) in links"
                :key="i"
                :class="$style.item"
            >
                <VPrismicLink
                    :to="link.internal_page"
                    :url="link.external_url"
                    :class="$style.link"
                >
                    <span :class="$style.label">{{ link.label }}</span>
                </VPrismicLink>
            </li>
        </ul>
    </nav>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/flex-grid' as *;
@use 'assets/scss/variables/fonts' as *;
@use "assets/scss/mixins/theme" as *;
@use "assets/scss/functions/ease" as *;

.root {
    position: fixed;
    z-index: 11;
    bottom: rem(24);
    left: 0;
    width: 100%;
    grid-column: 1 / -1;

    @include theme-variants;

    @include media('>=md') {
        position: relative;
        bottom: initial;
        left: initial;
        grid-column: 9 / -1;
    }

    @include media('>=lg') {
        grid-column: 7 / span 1;
    }
}

.list {
    display: flex;
    flex-direction: column;
    padding: initial;
    margin-block: initial;

    @include media('<md') {
        width: fit-content;
        flex-direction: row;
        justify-content: center;
        border-radius: rem(12);
        background-color: var(--theme-color-background);
        margin-inline: auto;
    }
}

.item {
    display: contents;
}

.link {
    display: flex;
    padding: initial;
    color: var(--theme-color-brand-inactive);
    font-family: $font-suisse-family;
    font-size: rem(16);
    font-weight: 300;
    line-height: 1.4;
    padding-inline: initial;
    text-decoration: none;
    text-transform: uppercase;
    transition: color 0.3s;

    &[aria-current="page"] {
        color: var(--theme-color-brand-text);
        font-weight: 400;
    }

  @media (hover: hover) {
    &:hover {
      color: var(--theme-color-brand-text);
    }
  }

    @include media('<md') {
        padding-block: rem(18);
        padding-inline: rem(14);

        .item:first-child & {
            padding-left: rem(24);
        }

        .item:last-child & {
            padding-right: rem(24);
        }
    }

  @include media('>=md') {
        font-size: rem(14);
        font-weight: 400;
        line-height: 1.3;
        text-transform: initial;
  }
}
</style>
