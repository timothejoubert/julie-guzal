<script setup lang="ts">
import type { NuxtError } from 'nuxt/app'
import { I18N_DEFAULT_LOCALE } from '~/i18n/i18n.config'

useSeoMeta({ robots: 'noindex, nofollow' })

const props = defineProps<{
    error: NuxtError
}>()

const statusCode = computed(() => props.error?.statusCode)

// const { t } = useI18n()
// const title = computed(() => {
//     return t('error_code', { code: statusCode.value })
// })
// const message = computed(() => {
//     if (statusCode.value === 404) return t('error_page.not_found.body')
//     return t('error_page.body')
// })

onMounted(() => {
    // force reload if navigation occurs
    const router = useRouter()
    const unwatchRouter = router.afterEach(() => {
        unwatchRouter()

        // reload
        window.history.go(0)
    })
})

const runtimeConfig = useRuntimeConfig()
const siteUrl = runtimeConfig.public.site.url

const dateTime = computed(() => {
    const date = new Date()
    const localizedDate = date.toLocaleDateString(I18N_DEFAULT_LOCALE, {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
    })
    return localizedDate.split(',')?.[1].trim()
})

// Log the error for debugging purposes
console.error('Error page:', props.error)
</script>

<template>
    <div :class="$style.root">
        <header
            class="grid"
            :class="$style.header"
        >
            <div :class="$style.date">
                {{ $t('lost_in_the_stars') }}
                <br>
                {{ dateTime }}
            </div>
            <a
                :href="siteUrl"
                :class="$style.link"
            >
                <VIcon
                    name="arrow-down"
                    width="57"
                    height="71"
                    :class="$style.icon"
                />
                <span :class="$style['link__label']">
                    {{ $t('back_to_earth') }}
                </span>
            </a>
        </header>
        <main :class="$style.main">
            <VPixelatedText
                root-tag="h1"
                :class="$style.title"
                :label="statusCode.toString()"
            />
        </main>
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/variables/fonts' as *;
@use 'assets/scss/functions/fluid' as *;

.root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overflow: hidden;
}

.header {
    margin-block: rem(24);
    row-gap: rem(48);
}

.date {
    font-family: $font-lecturis-family;
    font-size: rem(16);
    font-weight: 300;
    line-height: 1.4;
    grid-column: 1 /-1;
    text-transform: uppercase;

    @include media('>=md') {
        grid-column: 1 / span 3;
    }
}

.link {
    display: flex;
    justify-content: flex-end;
    grid-column: 1 / -1;
    color: var(--theme-color-on-background);
    text-decoration: initial;
    font-family: $font-lecturis-family;
    font-size: fluid((xs: 70, xl: 100));
    text-transform: uppercase;
    font-weight: 300;
    line-height: 0.96;

    @include media('>=md') {
        grid-column: 5 / -1
    }
}

.icon {
    margin-right: rem(14);
    flex-shrink: 0;
    margin-top: 0.16lh;
    transition: color 0.3s;

    @media (hover: hover) {
        .link:hover & {
            color: var(--theme-color-primary);
        }
    }

    @include media('<lg') {
        color: var(--theme-color-primary);
    }
}

.link__label {
    width: 7ch;
}

.title {
    font-family: $font-lecturis-family;
    font-size: fluid((xs: 200, xl: 491));
    font-weight: 300;
    line-height: 1;
    margin-block: initial;
    grid-column: 1 /-1;
    text-transform: uppercase;
}

.main {
    margin-top: auto;
}
</style>
