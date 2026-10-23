import { I18N_DEFAULT_LOCALE, I18N_LOCALES } from '#root/constants/i18n'
import { SPLASH_HEAD_SCRIPT } from '#root/constants/splash-screen'
import staticPage from '#root/constants/static-page.js'
import { version } from '#root/package.json'
import { repositoryName } from '#root/prismic.config.json'
import { getDocumentRoutePath, prismicDocumentRoutes } from '#root/utils/prismic/route-resolver'
import { createClient, filter } from '@prismicio/client'
import svgLoader from 'vite-svg-loader'

const isProd = process.env.NUXT_PUBLIC_SITE_ENV === 'production'

export default defineNuxtConfig({
    // Setup app modules
    modules: [
        '@nuxtjs/svg-sprite',
        '@nuxt/image',
        '@nuxtjs/prismic',
        '@nuxtjs/i18n',
        '@vueuse/nuxt',
        '@nuxt/eslint',
        '@nuxtjs/sitemap',
        '@nuxtjs/robots',
    ],
    plugins: [],
    components: [
        '~/components/atoms',
        '~/components/molecules',
        '~/components/organisms',
    ],
    devtools: { enabled: true },
    app: {
        layoutTransition: false, // Prevent issue with layout without root element
        head: {
            htmlAttrs: { lang: 'en', class: 'app' },
            // Without JS nothing reveals `.element-translate` (opacity: 0 until the reveal class is added): keep the content visible
            noscript: [
                { innerHTML: '<style>.element-translate{opacity:1!important;translate:none!important;transition:none!important}</style>' },
            ],
            link: [
                { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
                { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
                { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/favicon-48x48.png' },
                { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
                { rel: 'manifest', href: '/site.webmanifest' },
            ],
            script: [
                // Splash screen: first visit of the session only, decided before first paint
                { innerHTML: SPLASH_HEAD_SCRIPT, tagPriority: 'critical' },
                isProd
                    ? undefined
                    : {
                            src: `https://static.cdn.prismic.io/prismic.js?new=true&repo=${repositoryName}`,
                            async: true,
                            defer: true,
                        },
            ],
        },
    },
    css: ['~/assets/scss/main.scss'],
    router: {
        options: {
            scrollBehaviorType: 'auto', // instant: the page transition handles the motion (a smooth scroll would fight Lenis)
        },
    },
    // https://nuxtseo.com/docs/site-config/getting-started/how-it-works
    // Shared by @nuxtjs/robots and @nuxtjs/sitemap: only production is indexable
    // (staging builds output `Disallow: /` and a `noindex` robots meta).
    site: {
        env: process.env.NUXT_PUBLIC_SITE_ENV || 'development',
        indexable: isProd,
    },
    runtimeConfig: {
        github: {
            repo: '/timothejoubert/julie-guzal',
            userToken: '',
        },
        public: {
            version,
            site: {
                name: 'Julie Guzal | dev',
                url: '',
                environment: '',
            },
        },
    },
    alias: {
        '#root': __dirname,
    },
    ignore: [
        'assets/backup/**',
        '.claude/**', // AI agents' git worktrees (full project copies)
    ],
    experimental: {
        sharedPrerenderData: true, // shares payload data between pages that are prerendered (always use unique key in useAsyncData)
        payloadExtraction: false,
        asyncContext: true,
        appManifest: false, // We don't need client route rules for now, and Nuxt makes an extra request to get them.
    },
    compatibilityDate: '2024-07-09',
    nitro: {
        compressPublicAssets: true,
        minify: true,
        prerender: {
            // crawlLinks: true, // enabled by default with nuxt generate, not required
            routes: ['/'], // add any routes to prerender (usefull for sitemap generation)
        },
        // https://nitro.build/config#routerules
        // Static hosting: headers, cache and real 301s are NOT applied from here in production,
        // they live in `public/.htaccess`. The redirects below only serve `pnpm dev`.
        routeRules: {
            '/home': { redirect: '/' },
            '/accueil': { redirect: '/' },
            '/en': { redirect: '/' },
            '/about': { redirect: '/contact' },
            '/en/about': { redirect: '/contact' },
            '/projects/arturia': { redirect: '/' },
            '/**': {
                prerender: true, // pre-rendered at build time
                ssr: true, // when prerendered, it will have the full html of the page present, not an empty div
            },
            [staticPage.PREVIEW]: {
                prerender: false, // Exclude from sitemap and robot.txt
                robots: false,
            },
            '/slice-simulator': {
                prerender: false, // Exclude from sitemap and robot.txt
                robots: false,
            },
            '/_icons': {
                prerender: false,
                robots: false,
            },
        },
    },
    vite: {
        server: {
            watch: {
                // AI agents' git worktrees contain full project copies (node_modules, .nuxt…)
                ignored: ['**/.claude/**'],
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "assets/scss/_resources.scss" as *;',
                    quietDeps: true,
                },
            },
        },
        plugins: [
            // https://github.com/jpkleemans/vite-svg-loader?tab=readme-ov-file#setup
            svgLoader({
                svgoConfig: {
                    multipass: true,
                    plugins: [
                        {
                            name: 'preset-default',
                            params: {
                                overrides: {
                                    removeTitle: false,
                                    // viewBox is required to resize SVGs with CSS.
                                    // @see https://github.com/svg/svgo/issues/1128
                                    removeViewBox: false,
                                },
                            },
                        },
                    ],
                },
                defaultImport: 'url',
            }),
        ],
    },
    hooks: {
        // Archived projects are linked from nowhere, so the generate crawler never reaches them:
        // prerender them explicitly to keep their URL alive (they are noindex, see usePrismicSeoMeta).
        async 'prerender:routes'(ctx) {
            const archivedProjects = await createClient(repositoryName).getAllByType('project_page', {
                filters: [filter.at('my.project_page.archived', true)],
                fetch: [],
            })
            const projectPath = getDocumentRoutePath('project_page')

            archivedProjects.forEach(project => ctx.routes.add(`${projectPath}${project.uid}`))
        },
    },
    // https://eslint.nuxt.com/packages/module
    eslint: {
        config: {
            stylistic: {
                indent: 4,
            },
        },
    },
    i18n: {
        strategy: I18N_LOCALES.length > 1 ? 'prefix_except_default' : 'no_prefix',
        // I18n issue, disabled detectBrowserLanguage work only with empty obj
        // https://github.com/nuxt-modules/i18n/issues/3039
        detectBrowserLanguage: false,
        defaultLocale: I18N_DEFAULT_LOCALE,
        locales: I18N_LOCALES.map(locale => ({
            code: locale,
            file: `nuxt.${locale}.json`,
        })),
        lazy: true,
        compilation: {
            strictMessage: false, // Allow value to include HTML
        },
    },
    // https://image.nuxt.com/get-started/configuration
    image: {
        imgix: {
            baseURL: '',
        },
        quality: 75,
        // https://image.nuxt.com/get-started/configuration#screens
        screens: {
            xs: 375,
            sm: 480,
            md: 768,
            lg: 1024,
            vl: 1280, // initially xl
            xl: 1440,
            xxl: 1600,
            hd: 1920,
            qhd: 2500,
        },
        // @ts-expect-error not working with [1]
        densities: '1',
        presets: {
            default: {
                sizes: 'xs:100vw md:100vw lg:100vw xl:100vw hd:100vw qhd:100vw',
            },
        },
    },
    prismic: {
        endpoint: repositoryName,
        preview: staticPage.PREVIEW,
        toolbar: !isProd,
        clientConfig: {
            routes: prismicDocumentRoutes,
        },
    },
    robots: {
        // provide simple disallow rules for all robots `user-agent: *`
        disallow: ['/slice-simulator', staticPage.PREVIEW, '/_icons'],
    },
    // https://www.nuxtseo.com/sitemap/getting-started/installation
    sitemap: {
        // <lastmod> from Prismic (merged by `loc` with the prerendered pages). Archived projects are noindex: left out.
        async urls() {
            const documents = await createClient(repositoryName, { routes: prismicDocumentRoutes }).dangerouslyGetAll({
                filters: [filter.any('document.type', prismicDocumentRoutes.map(route => route.type))],
                fetch: ['project_page.archived'],
            })

            return documents
                .filter(document => document.url && !(document.type === 'project_page' && document.data.archived))
                .map(document => ({ loc: document.url!, lastmod: new Date(document.last_publication_date).toISOString() }))
        },
        exclude: ['/_icons', '/_icons/**', '/slice-simulator', staticPage.PREVIEW, `${staticPage.PREVIEW}/**`],
    },
    // https://github.com/nuxt-modules/svg-sprite#options
    // ".DS_Store" file could create an error sometime during parsing svg
    svgSprite: {
        input: '~/assets/images/icons',
        output: '~/assets/images/sprites',
    },
})
