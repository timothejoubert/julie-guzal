## In progress
- A11Y médias & motion (PR fix/a11y-media-motion) : prefers-reduced-motion (molette bloquée), visionneuse au clavier, pause vidéo, contraste du focus

## TODO
- Vérifier la prod après la prochaine release : .htaccess (pas de 500, 301 http/www, br, /contact en 200), workflow Deploy prod, webhook Prismic (Trigger OK, 401 sans secret)
- CSP : passer de Report-Only à appliquée si la console prod est propre, puis retirer 'unsafe-inline' (hashes au build)
- Prismic : renseigner settings.socials (sameAs du JSON-LD)
- Splash : sessionStorage par onglet, passer en cookie de session si besoin
- Déploiement : clé SSH au lieu du mot de passe FTP + environment GitHub "production" protégé
- Splash Screen (lottie)
- CLS page contact (polices) : PR #24 fermée, à reprendre ?
- Regénérer et upload uniquement la page modifié sur prismic
- Add v-nav theme color for mobile and desktop (with 'filled' style name)
- pageProject: back link sticky ?

## Later
- Ajouter prefetch on nav link

## Need review
- debug VDraggableScroll : logique de scroll réécrite dans fix/media-viewer-slide, à revérifier
- Validation RGAA par les référents (landmarks, h1, skip link, toast, média/motion)

## Done
- Page projet inexistante : vraie page 404 (#18)
- Contenu visible sans JS (#19)
- VImg ne rend plus crossorigin="false" (#20)
- Précharger le hero du projet au survol/focus de la card (#22)
- Précharger le document Prismic du projet au survol/focus de la card (#23)
- Mettre à jour les deps (pnpm 11, Nuxt 4.5, Prismic CLI à la place de Slice Machine, Nuxt Image v2, @prismicio/vue v6, dépréciations Sass)
- Setup IA : CLAUDE.md + CI sur les PR (lint + generate)
- Audit sécurité : workflow de déploiement durci (actions épinglées par SHA), secret du webhook Prismic, en-têtes de sécurité + CSP report-only (.htaccess)
- Ajouter les regles de cache (.htaccess) + compression br/gz
- Add redirection (vraies 301 dans .htaccess)
- Audit SEO : titres/OG/Twitter unifiés, JSON-LD, sitemap, staging non indexable
- Audit A11Y (structure) : landmarks, un seul h1, skip link, lang, toast annoncé
- Optimisation pageSpeed : LCP accueil, sizes, polices woff2, splash non bloquant (1re visite seulement), lazy embeds vidéo, payload Prismic réduit, CLS du titre
- Améliorer les transitions de page (transform only, hero décodé avant apparition, scroll de la page sortante conservé)
- Améliorer le layout masonry (placement déterministe, 2 parallax au lieu de 43, resize optimisé)
- Fix bug media viewer : slide courante parfois cachée
- Page transition home -> project
- enlever payload
- check meta seo
- Use NuxtPage name with composable for common page setup
- Slice simulator preview not working correctly for some slices
- Auto deploy (build or generate)
- check lightSpeed (seo, a11y, perf)
- add canonical url
- ajouter nuxtRouterAnnouncer
- enlever prismic preview sur prod
- image share
- update node version (netlify and package)
- Prerender all page except Preview
- Preview (Preview page should be build on fly and others prerender)
- 404 page isn't displayed (ex: https://julieguzal.fr/en/)
- setup CI/CD with OVH server [tuto](https://help.ovhcloud.com/csm/fr-web-hosting-git-integration?id=kb_article_view&sysparm_article=KB0063755)
- Deploy on OVH
  - SSG: with gh actions push 'pnpm generate' output (when new tag is pushed) to OVH hosting
  - Hybrid: create branch for prod and store prod assets, sync OVH data to this branch and pull when code is updated
  - Setup github action to generate app and upload file on OVH [can't set body content in prismic webhook](https://community.prismic.io/t/setting-response-body-in-webhooks/9761/23)
- Add runtime deploy-server-route (not generated in process)
- update .env SITE_URL
- enable site on robots.txt
- check sitemap
- page transition
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
- Update typo (menu item nav , credit)
- verifier si l'import des svg functionne
- qualite photo mediaViewer (mauvaise dimension dans prismic)
- GelleryGrid: crop horizontal d'img dans la gallery
- ProjectPage: button back projet couleur
- enlever crop sur img contact
- aligner line au center
- titre 2 mots a la ligne
- enlever controls vimeo (autoplay)
- lab (possibilité de mettre des vidéos)


## Abandoned
- Create VPageFactory ?
- CrossNav: Text Reveal
- Top bar | bug de disparition de la top bar au changement de page
