## In progress
- page transition
- Remove page payload ? 
- Add cache on generated page (swr, isr ?)
-remove toolbar script ? [issue 1](https://github.com/prismicio/prismic-toolbar/issues/119) | [issue](https://community.prismic.io/t/disable-io-prismic-preview-cookie-for-visitors/12311/23)
- 
## TODO
- VSplashScreen
- setup CI/CD with OVH server [tuto](https://help.ovhcloud.com/csm/fr-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063755)
- Prerender all page except Preview (static for all page and Client-Side Rendering for preview)

## later
- Use NuxtPage name with composable for common page setup 
- Slice simulator preview not working correctly for some slices

## Need review
- Top bar | bug de disparition de la top bar au changement de page
- Preview (Preview page should be build on fly and others prerender)
- pageProject: back link sticky ?
- 
## Abandoned 
- Add v-nav theme color for mobile and desktop (with 'filled' style name)
- Create VPageFactory ?
- CrossNav: Text Reveal
- 
## Done
- Page error
- VTopBar | text reveal
- Footer | text reveal
- page photo | apparition img fullscreen sans défilement de toutes les slides
- Fix mediaViewer carousel (resize & bug de snap)
- page photo | disable arrow if first or last slide
- page photo | responsive
- page photo | slide fade in/out
- PhotoPage & LabPage: Parallax
- Media Viewer, le curseur devient les fleches
- VPrismicLink slot warning
- page photo | callage description par rapport a la photo
- page photo | enlever cursor + enlever fond fleche
- nav | couleur lien inactif (page contact)
- text nav | comportement classique
- Taille des fleches dans le footer
- Add project_date_order for
- Resolve prismic document url from type
- Embed video
- Setup Github webhook on netlify
- redesign nav
- Nav on mobile
- create GalleryGrid with repeatable field instead unique Photography slice
- Fix preview
- Hybrid render with preview page
- VNav mobile
- VPrismicMedia
- ContentSlice
- Create VArrowButton
- Fix SvgSprite
- VFilterBar
- Color theme logic
- Style typo
- Deploy preprod
- attrs and seo meta 


## RECETTE: Done
- hover des liens externes
- ContatcPage: lien custom dans prismic
- 
- Update typo (menu item nav , credit)
- 
- verifier si l'import des svg functionne
- 
- qualite photo mediaViewer (mauvaise dimension dans prismic)
- GelleryGrid: crop horizontal d'img dans la gallery
- 
- ProjectPage: button back projet couleur
- 
- enlever crop sur img contact
- aligner line au center
- titre 2 mots a la ligne

- enlever controls vimeo (autoplay)
- lab (possibilité de mettre des vidéos)
