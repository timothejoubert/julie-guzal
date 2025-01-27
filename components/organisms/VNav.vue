<script lang="ts" setup>
const menu = await usePrismicMenuDocument()

const links = menu.value?.data.links || []
</script>

<template>
    <nav
        aria-label="Main"
        :class="$style.root"
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
@use 'assets/scss/functions/rem' as *;
@use 'assets/scss/functions/flex-grid' as *;
@use 'assets/scss/variables/fonts' as *;
@use "assets/scss/mixins/include-media" as *;
@use "assets/scss/functions/ease" as *;

.root {
    @include media('>=lg') {
        width: flex-grid(11, 14);
    }
}

.list {
    display: flex;
    flex-direction: column;
    width: 50%;
    padding: initial;
    margin-block: initial;
}

.item {
    list-style: none;
}

.link {
    display: flex;
    color: inherit;
    padding: initial;
    padding-inline: initial;
    text-decoration: none;
    text-transform: uppercase;

    &[aria-current="page"] {
      text-decoration: underline;
    }
}
</style>
