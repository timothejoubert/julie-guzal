# Changelog

All notable changes to this project will be documented in this file.

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
