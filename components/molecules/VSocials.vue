<script  lang="ts" setup="">
const settings = await usePrismicSettingsDocument()
const socials = settings?.data.socials
</script>

<template>
    <ul
        :class="$style.list"
        :aria-label="$t('socials')"
    >
        <li
            v-for="(social, i) in socials"
            :key="social.external_url || i"
            :class="$style.item"
        >
            <VPrismicLink
                :to="social.external_url"
                :aria-label="social.icon || social.label"
                :class="$style.link"
            >
                <VIcon
                    v-if="social.icon"
                    :name="`social-${social.icon}`"
                />
                <template v-else-if="social.label">
                    {{ social.label }}
                </template>
            </VPrismicLink>
        </li>
    </ul>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;

.list {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    gap: calc(var(--gutter) );
}

.item {
    display: flex;
    align-items: center;
    justify-content: center;
    list-style: none;
}

.link {
    display: contents;
    color: inherit;
}
</style>
