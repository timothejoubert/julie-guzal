<script  lang="ts" setup>
const settings = await usePrismicSettingsDocument()
const description = settings?.data?.site_description

defineProps<{
    title?: string
}>()
</script>

<template>
    <div
        :class="$style.root"
        class="grid"
    >
        <h1 :class="$style.title">
            {{ title }}
        </h1>
        <VNav :class="$style.nav" />
        <VText
            v-if="description"
            :content="description"
            tag="h2"
            :class="$style.content"
        />
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;
@use 'assets/scss/functions/fluid' as *;
@use 'assets/scss/variables/fonts' as *;
@use 'assets/scss/mixins/include-media' as *;

.root {
    position: sticky;
    z-index: 101;
    top: 0;
    padding-block: rem(24);
}

.title {
  grid-column: 1 / span 5;
  font-family: $font-lecturis-family;
  font-weight: 300;
   line-height: 1;
  //line-height: 0.69; // Compensate font box sizing
  font-size: fluid((xs: 100, xl: 100));
  margin-block: initial;
  text-transform: uppercase;
  translate: 0 -0.14lh;
}

.nav {
  grid-column: 7;
}

.content {
  grid-column: 10 / span 2;
  font-family: $font-suisse-family;
  font-size: rem(14);
  line-height: 1.42;
  font-weight: 400;
  margin-block: initial;
}
</style>
