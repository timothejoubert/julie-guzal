// Lighthouse CI: audits the static build (`pnpm generate`) to keep the perf / a11y / SEO gains.
// https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
const fs = require('node:fs')
const path = require('node:path')

const STATIC_DIR = '.output/public'

// Project uids come from Prismic: audit the first generated one instead of hardcoding it
const projectDir = path.join(STATIC_DIR, 'project')
const projectUid = fs.existsSync(projectDir)
    ? fs.readdirSync(projectDir, { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name).sort()[0]
    : undefined

module.exports = {
    ci: {
        collect: {
            staticDistDir: STATIC_DIR,
            // Trailing slash: the LHCI static server doesn't resolve `/contact` to `contact/index.html` like `.htaccess` does
            url: ['/', '/contact/', '/lab/', '/gallery/', projectUid && `/project/${projectUid}/`]
                .filter(Boolean)
                .map(pathname => `http://localhost${pathname}`),
            // One run: a11y / SEO / best practices are deterministic, perf only warns
            numberOfRuns: 1,
            settings: {
                preset: 'desktop',
                // `is-crawlable` fails on purpose: CI builds are staging (noindex)
                skipAudits: ['is-crawlable'],
                // The Prismic toolbar is only injected in non-production builds (third-party cookies, console issues)
                blockedUrlPatterns: ['*static.cdn.prismic.io/prismic.js*', '*.prismic.io/prismic-toolbar/*'],
            },
        },
        assert: {
            // CI runners are noisy: perf only warns, a11y / SEO / best practices block.
            // a11y / SEO thresholds match the current baseline (missing image alts, untitled iframes, nav target size):
            // raise them to 0.95 once those are fixed.
            assertions: {
                'categories:performance': ['warn', { minScore: 0.9, aggregationMethod: 'median-run' }],
                'categories:accessibility': ['error', { minScore: 0.85, aggregationMethod: 'median-run' }],
                'categories:seo': ['error', { minScore: 0.85, aggregationMethod: 'median-run' }],
                'categories:best-practices': ['error', { minScore: 0.9, aggregationMethod: 'median-run' }],
            },
        },
        upload: {
            target: 'filesystem',
            outputDir: '.lighthouseci',
        },
    },
}
