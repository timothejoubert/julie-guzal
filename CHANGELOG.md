# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-10-23

### 🚀 Features

- *(seo)* Unify page title, complete Open Graph tags and add JSON-LD
- *(seo)* Add a title to the error page
- *(htaccess)* Harden Apache config (redirects, security headers, compression, cache)
- *(transitions)* Reveal project pages once their hero image is decoded
- *(parallax)* Add useScrollParallax to create scrubbed parallax tweens in one place

### 🐛 Bug Fixes

- *(ci)* Harden production deploy workflow
- *(a11y)* Set document lang and translate the main nav label
- *(a11y)* Add a skip link to the main content
- *(a11y)* Fix landmarks and heading hierarchy
- *(a11y)* Announce toasts and expose split text as a whole
- *(a11y)* Enhance accessibility with visually-hidden class and aria-labels
- *(seo)* Escape JSON-LD and drop nullish keys properly
- *(images)* Use existing hd screen instead of unknown hq in sizes
- *(seo)* Drop nofollow on internal project card link
- *(netlify)* Require Prismic webhook secret before dispatching deploy
- *(lenis)* Drive Lenis from the GSAP ticker and load its stylesheet
- *(transitions)* Compute page direction from the cached menu
- *(lenis)* Keep the leaving page scroll position during page transitions
- *(masonry)* Place items from media dimensions instead of measuring the DOM
- *(parallax)* Adjust parallax layer movement for consistent speed across item sizes
- *(masonry)* Add endShift option to adjust second column offset for parallax effect
- *(media-viewer)* Keep carousel scroll position and active slide in sync
- *(error)* Correct status code retrieval and improve date formatting
- *(page)* Show the 404 error page for unknown documents
- Keep revealed content visible without JavaScript
- *(img)* Don't render crossorigin="false" on images
- *(VPrismicLink)* Pass the resolved url to NuxtLink instead of the ref
- Update hero image class for improved accessibility and remove unused styles
- *(layout)* Apply the page background to html so the scrollbar gutter matches the page
- *(layout)* Paint the scrollbar track with the page background
- *(layout)* Always show the scrollbar so its track follows the page background
- *(layout)* Keep the theme background on html, page color on the scrollbar track only
- *(scroll-lock)* Share the html scroll lock between page transition and media viewer

### 🚜 Refactor

- Update Prismic imports and configurations
- Improve SCSS functions and mixins, remove unused VCopyright component
- Restructure LazySliceZone component placement within VHomePage template
- Remove unused peerDependencyRules from pnpm-workspace.yaml
- *(seo)* Remove hreflang alternate links and unused fr locale
- *(gsap)* Import ScrollTrigger from the ESM build and drop unused plugins
- *(gallery)* Set up the merged gallery parallax with useScrollParallax
- *(TODO)* Update in-progress and review sections for clarity and relevance
- *(VProjectCard)* Improve comments and adjust hero preload width
- *(layout)* Replace the page background scrollbar setup with scrollbar-gutter: stable

### 📚 Documentation

- *(parallax)* Correct why useMediaQuery is used instead of gsap.matchMedia
- Allow direct commits on develop for this personal project
- Document Prismic deploy relay and add release checklist

### ⚡ Performance

- *(home)* Load the first project card image eagerly with high priority
- *(video)* Lazy-load embed iframes
- *(fonts)* Ship woff2 only
- Show the splash screen once per session without blocking the page
- *(transitions)* Animate page transitions with transforms only
- Show the splash screen once per session without blocking the page
- *(top-bar)* Add metric-matched fallback font to limit title CLS
- *(prismic)* Fetch only card fields for project lists to shrink inlined payload
- *(video)* Load embeds and native videos only when near the viewport
- *(project-card)* Preload the project hero image on hover and focus
- *(project-card)* Prefetch the project Prismic document on hover and focus

### 🎨 Styling

- *(media-viewer)* Keep inactive slides fully opaque
- *(a11y)* Remove focus outline on main content skip link target

### ⚙️ Miscellaneous Tasks

- Update todo
- Add CLAUDE.md and pull request CI workflow
- *(seo)* Only index production and exclude technical routes from sitemap
- Ignore AI agents' git worktrees in git, Nuxt and Vite watcher
- Remove the unused splash videos and their cache rule
- Remove the unused splash videos and their cache rule
- Update todo with the completed roadmap
- Update todo
- *(node)* Bump to 24.22.1 LTS
- *(pnpm)* Update to pnpm 12.15.0
- Declare the package as ESM

## [1.0.10] - 2025-09-04

### 🎨 Styling

- Update favicon.svg
- Add png favicon

## [1.0.9] - 2025-08-16

### 🎨 Styling

- Fix favicon meta

## [1.0.8] - 2025-07-07

### 🐛 Bug Fixes

- Remove splashScreen video

## [1.0.7] - 2025-07-07

### ⚙️ Miscellaneous Tasks

- Run lint-fix

## [1.0.6] - 2025-07-07

### 🎨 Styling

- Add splash screen video

## [1.0.5] - 2025-07-02

### ⚙️ Miscellaneous Tasks

- Run lint-fix

## [1.0.4] - 2025-07-02

### 💼 Other

- Update build-prod.yaml
- Update build-prod.yaml
- Update build-prod.yaml and fix file-deployer local-path
- Update build-prod.yaml
- Update deps
- Remove payload from build

### 🚜 Refactor

- Simplify function

### ⚙️ Miscellaneous Tasks

- Update todo

## [1.0.3] - 2025-07-01

### 💼 Other

- Update upload and downlaod artifact path
- Fix actions-file-deployer local-path

## [1.0.2] - 2025-07-01

### 🐛 Bug Fixes

- Fix type and page title
- Update seo meta

### 💼 Other

- Update nitro config
- Update nitro page config

### 🎨 Styling

- Add NuxtRouteAnnouncer

### ⚙️ Miscellaneous Tasks

- Update todo and .htaccess
- Don't use defineRouteRules

## [1.0.1] - 2025-07-01

### 💼 Other

- Trigger gh workflow only on tag update
- Add netlify function
- Update output dir for ssg
- Update nuxt secret

### ⚙️ Miscellaneous Tasks

- Update .env and add comment

## [1.0.0] - 2025-07-01

### 🚀 Features

- Integration
- Page integration
- Add simpleContent slice
- Improve VPrsimicMedia
- Add sticky animation on nav
- Fix preview page
- MasonryMedias iuntegration
- Remove photography slice and add galleryGrid
- Update img dimension attrs if has ar props
- Add autoplay option on media slice
- Add custom smooth scroll snap on VDraggableScroll
- Add project external link label
- Add and init lenis
- Add projectFeed
- Add VLoading indicator
- Update deps
- Update img props
- Add VToat, add VPrismicLinkIcon and use custom link component in PrismicRichText
- Add VMergedGallerySlice to allow separate slice in prismic page builder
- Add order_date for project and use it for project collection fetch
- Fix VPrismicLink and update hyperlink icon style
- *(VVideoPlayer)* Add allow attrs and remove vimeo cookie
- *(VMergedGallerySlice)* Add gsap tween
- (MasonryMedias): add gsap tweens
- Add reveal element animations
- Setup card page transition
- Add page cache
- Add sitemap and robot nuxt module
- Update i18n strategy depending on available locale length
- Add fetch to github api

### 🐛 Bug Fixes

- *(VVideoPlayer)* Pointer event none on video with no control
- Fix VPrismicLink rendered slots
- Prevent loading to get stuck
- Better first reveal VMediaViewer animation
- *(VMediaViewer)* Disbaled dragging and update slide layout
- Debug gh workflow
- Udpate build-staging workflows
- Add zIndex on VMediaViewerContent controls button
- Remove page transiton under 700px
- Run lint-fix
- Fix preview page content
- Fix isPreview route
- Update composables and fix preview page

### 💼 Other

- Update VGalleryPage
- Update GalleryGrid layout and VMediaViewer
- Init splash screen
- Init page transition
- Add meta description
- Update deps
- Update error page
- Init page transition
- Update page transition
- Use overlay transition
- Update all deps
- Add alt attr on img
- Add github workflow
- Remove current alternate meta tag
- Update node
- Add prefetch on vnav link
- Add redirection
- Add .htaccess
- Remove prismic toolbar for prod env

### 🚜 Refactor

- Rename VPixelatedText to VTextGlitched and simplify code
- Clean VDraggableScroll code

### ⚡ Performance

- *(VProjectPage)* Add loading eager on image
- Discreet smooth scroll with prefers-reduce-motion and on touch

### 🎨 Styling

- Setup typography and start VTopBar integration
- VProjectPage integration
- Adapt media document in mediaSlice
- Remove grid max-width
- Update nav theme and title content
- Init gallery page
- *(MasonryMedias)* Add offset top for second column
- Add  scrollbar-gutter: stable
- *(MediaSlice)* Update second img position
- Fix project card position
- *(VProjectCard)* Fix layout shift
- *(VProjectPage)* Update content style and remove credits section if no content
- Adapt time position
- Add select spacing in MediaSlice
- Update font-size
- Fix img format in GalleryGrid
- *(VProjectPage)* Update back link theme
- Update VNav and topBar font style
- Update img size
- *(VMergedGallerySlice)* Fullwidth img on mobile
- *(CrossNav)* Update arrow icon
- *(VProjectCrossLink)* Update hover arrow style
- *(VContactPage)* Fix displayed text or img
- Set CrossNav as position sticky bottom
- *(VFollowCursor)* Hide on hover other element
- *(VTopBar)* Adapt top bar text position
- Color, grid and layout adjustment
- *(VMergedGallerySlice)* Adapt background under MD
- *(VMergedGallerySlice)* Fix background offset
- *(VTopBar)* Adapt text position
- Update under MD margin grid
- Adapt slice padding and VTopBar font
- Adapt VContactPage text
- Adapt color button for safari
- *(VProjectPage)* Add custom picture source
- Add meta tag theme-color
- *(SimpleText)* Add row-gap
- *(VProjectCrossLink)* Display arrow by default on mobile
- *(ProjectFeed)* Increase row-gap on mobile
- *(VContactPage)* Adapt fonts and min-height
- *(VMediaViewerContent)* Set button color for safari
- *(MasonryMedias)* Adapt image padding
- Fix VLabPage theme-color meta
- *(VMediaViewerContent)* Set button color for safari
- *(VTopBar)* Add pointer-event: none; when topBar is hidden
- Clean page transition scroll-bar
- Adapt siwe for smmall device
- *(VProjectCard)* Add hover
- *(VMergedGallerySlice)* Fix grid on safari
- *(VContactPage)* Update right__column placement
- *(VPrismicRichTextLink)* Add hover on mail button

### ⚙️ Miscellaneous Tasks

- Add gitignore file
- Lint fix
- Update node and pnpm version
- Use same node version as netlify
- Revert pnpm version
- Remove packageManager version
- Update generate folder
- Remove unused prop
- Update todo
- Upgrade slicemachine deps
- Update Photography slice
- Update trad and fix undefined value
- Remove unused code
- Update TODO
- Remove duplicate property
- Improve a11y
- *(API)* Update field
- Remove todo
- Remove comment
- Add img sizes
- Remove log
- *(api)* Add ExternalLinkLabel in project
- Lint-fix
- *(api)* Update spacing options
- Lint-fix
- Remove undefined file reference
- Lint-fix
- Add files in _ressources.scss
- Lint fix
- Lint fix
- Update TODO and stylelint fix
- Lint fix
- Add VFollowCursor
- Run lint-fix
- Add stylelint rule: declaration-property-value-no-unknown
- Lint-fix
- Remove duplicate attr
- Change i18n vars to constants file
- Run lint-fix
- Lint-fix
- Fix scss warning
- Run lint-fix
- Update build-staging
- Update build-staging
- Remove auto imported composable
- Run lint-fix
- Fix artifact path
- Add debug and artifact option
- Tru another path
- Retry workflow
- Retrigger deploy
- Remove checkout step
- Retrigger deploy
- Retrigger deploy
- Retrigger deploy
- Retrigger deploy
- Listen webhook event
- Setup build prod action
- Add env variables
- Add node vars and disabled build prod
- Remove page test
- Lint-fix
- Enabled build-deploy workflow
- Update robot.txt
- Update netlify redirect
- Lint fix
- Remove api route
- Run lint-fix
- Set preview page as client only
- Remove prefetch on vnav link
- Add bruno requests
- Run lint-fix

<!-- generated by git-cliff -->
