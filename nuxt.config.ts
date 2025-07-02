import svgLoader from 'vite-svg-loader'
import prismicData from './slicemachine.config.json'
import { endpoint } from '#root/slicemachine.config.json'
import { version } from '#root/package.json'
import staticPage from '#root/constants/static-page.js'
import { I18N_DEFAULT_LOCALE, I18N_LOCALES } from '#root/constants/i18n'
import { prismicDocumentRoutes } from '#root/utils/prismic/route-resolver'

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NUXT_PUBLIC_SITE_ENV === 'production'

export default defineNuxtConfig({
    // Setup app modules
    modules: [
        '@nuxtjs/svg-sprite',
        '@nuxt/image',
        '@nuxtjs/prismic',
        '@nuxt/image',
        '@nuxtjs/i18n',
        '@vueuse/nuxt',
        '@nuxt/eslint',
        '@rezo-zero/nuxt-stories',
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
            htmlAttrs: { class: 'app' },
            link: [
                { rel: 'icon', href: '/favicon/favicon.svg' },
                { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon/favicon-96x96.png' },
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
                { rel: 'manifest', href: '/favicon/site.webmanifest' },
            ],
            script: [
                isProd
                    ? undefined
                    : {
                            src: `https://static.cdn.prismic.io/prismic.js?new=true&repo=${prismicData.repositoryName}`,
                            async: true,
                            defer: true,
                        },
            ],
        },
    },
    css: ['~/assets/scss/main.scss'],
    router: {
        options: {
            scrollBehaviorType: 'smooth',
        },
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
        isDev ? undefined : 'pages/_stories/**',
        'assets/backup/**',
    ],
    experimental: {
        payloadExtraction: true,
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
                isr: true, //  generated on demand once until next deployment, cached on CDN
                headers: {
                    // 'Access-Control-Allow-Origin': 'Same-Origin \'self\' \'http://localhost:3000\' \'https://i.ytimg.com\'',
                    'Access-Control-Allow-Origin': '*',
                    // https://web.dev/articles/floc?hl=fr#can_websites_opt_out_of_being_included_in_the_floc_computation
                    'Permissions-Policy': 'interest-cohort=()',
                    // Hardening client security policies
                    // https://developer.mozilla.org/fr/docs/Web/HTTP/CSP
                    'Content-Security-Policy': [
                        // Only allows these iframe origins
                        'frame-src \'self\' https://julie-guzal.prismic.io *.youtube-nocookie.com *.youtube.com *.vimeo.com *.instagram.com *.soundcloud.com *.google.com *.deezer.com *.spotify.com',
                        // Only allows these script origins
                        'script-src \'self\' \'unsafe-inline\' https://html2canvas.hertzen.com https://prismic.io https://static.cdn.prismic.io *.googletagmanager.com *.youtube.com *.google.com *.googleapis.com *.gstatic.com',
                        // Only allows these images origins
                        // "img-src 'self' 'unsafe-inline' *.googleapis.com *.gstatic.com",
                    ].join('; '),
                },
            },
            [staticPage.PREVIEW]: {
                prerender: false,
                robots: false,
            },
            '/slice-smulator': {
                prerender: false,
                robots: false,
            },
        },
    },
    vite: {
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
    // https://eslint.nuxt.com/packages/module
    eslint: {
        config: {
            stylistic: {
                indent: 4,
            },
        },
    },
    i18n: {
        bundle: {
            optimizeTranslationDirective: false,
        },
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
        endpoint,
        preview: staticPage.PREVIEW,
        toolbar: !isProd,
        clientConfig: {
            routes: prismicDocumentRoutes,
        },
    },
    robots: {
        // provide simple disallow rules for all robots `user-agent: *`
        disallow: ['/slice-simulator', staticPage.PREVIEW],
    },
    // https://www.nuxtseo.com/sitemap/getting-started/installation
    sitemap: {
        // enabled: !isGenerateMaintenance,
        exclude: ['/slice-simulator', staticPage.PREVIEW],
        credits: false,
    },
    // https://github.com/rezozero/nuxt-stories
    stories: {
        pattern: [
            '**/*.stories.vue',
        ],
    },
    // https://github.com/nuxt-modules/svg-sprite#options
    // ".DS_Store" file could create an error sometime during parsing svg
    svgSprite: {
        input: '~/assets/images/icons',
        output: '~/assets/images/sprites',
    },
})
