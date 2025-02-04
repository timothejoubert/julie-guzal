<script  lang="ts" setup>
const settings = await usePrismicSettingsDocument()
const description = settings?.data?.site_description

const currentPage = useCurrentPage()
const pageTitle = computed(() => currentPage.value.webResponse?.data?.title)
const pageTitleMobile = computed(() => currentPage.value.webResponse?.data?.title_mobile)

const isProject = computed(() => currentPage.value.webResponse.type === 'project_page')
</script>

<template>
    <div
        v-if="!isProject"
        :class="$style.root"
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
        <VText
            v-if="description"
            :content="description"
            tag="h2"
            :class="$style.content"
        />
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/flex-grid' as *;
@use 'assets/scss/functions/fluid' as *;
@use 'assets/scss/variables/fonts' as *;

.root {
    z-index: 9;
    padding-block: rem(24);
}

.title {
  grid-column: 1 / -1;
  font-family: $font-lecturis-family;
  font-weight: 300;
   line-height: 1;
  //line-height: 0.69; // Compensate font box sizing
  font-size: fluid((xs: 100, xl: 100));
  margin-block: initial;
  text-transform: uppercase;
  translate: 0 -0.14lh;

    @include media('>=md') {
        grid-column: 1 / span 9;
    }

    @include media('>=lg') {
        grid-column: 1 / span 5;
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

    @include media('>=md') {
        grid-column: 10 / -1;
    }

    @include media('>=lg') {
        grid-column: 7 / span 1;
    }
}

.content {
    grid-column: 1 / -1;
    font-family: $font-suisse-family;
    font-size: rem(14);
    line-height: 1.42;
    font-weight: 400;
    margin-block: initial;
    max-width: flex-grid(9, 12);
    margin-top: rem(68);

    @include media('>=md') {
        grid-column: 1 / span 5;
    }

    @include media('>=lg') {
        grid-column: 10 / span 2;
        margin-top: initial;
    }
}
</style>
