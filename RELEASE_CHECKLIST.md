# Checklist release & mise à jour de la prod

Chaîne de déploiement et configuration : voir la section « Production deploy » du [README](README.md).
Les valeurs des secrets sont dans Bitwarden, jamais dans ce fichier.

## 1. Mise en place du relais Prismic → GitHub (une seule fois)

- [ ] Netlify (projet `julie-guzal`) → Environment variables : `NUXT_GITHUB_USER_TOKEN` et `PRISMIC_WEBHOOK_SECRET` créées
  - token fine-grained limité au repo `timothejoubert/julie-guzal`, permission *Contents: read & write*, date d'expiration notée dans Bitwarden
- [ ] `develop` poussé, build Netlify vert
- [ ] Netlify → Logs → Functions : `run-gh-dispatches` est listée
- [ ] `curl -i https://staging.julieguzal.fr/.netlify/functions/run-gh-dispatches` → `405`
- [ ] `curl -i -X POST https://staging.julieguzal.fr/.netlify/functions/run-gh-dispatches -d '{}'` → `401`
- [ ] Prismic → Settings → Webhooks : nouveau webhook avec l'URL de la fonction + le secret, déclencheurs publish/unpublish
- [ ] Bouton « Trigger » du webhook Prismic → `200`, puis un run « Deploy prod » (event `repository_dispatch`) dans GitHub → Actions
- [ ] Ancien webhook Prismic (vers `julie-guzal-webhook`) supprimé
- [ ] Repo `timothejoubert/julie-guzal-webhook` archivé (et son déploiement éventuel coupé)

## 2. Avant la release

- [ ] `develop` à jour, CI verte (lint + generate)
- [ ] `pnpm lint`
- [ ] `pnpm generate` sans erreur
- [ ] `pnpm preview` : home, une page projet, contact, photo, page 404 vérifiées dans le navigateur (desktop + mobile, clavier, `prefers-reduced-motion`)
- [ ] Staging (https://staging.julieguzal.fr) vérifiée sur les mêmes pages

## 3. Release

- [ ] Branche `release/x.y.z` depuis `develop`
- [ ] Version mise à jour dans `package.json`
- [ ] `CHANGELOG.md` regénéré avec git-cliff
- [ ] Merge dans `main` (et retour dans `develop`)
- [ ] Tag `x.y.z` poussé
- [ ] Run « Deploy prod » vert : job `build` puis `SFTP-Deploy-Action`

## 4. Vérification de la prod

- [ ] `curl -I https://julieguzal.fr` → `200`, header `Strict-Transport-Security` présent
- [ ] `curl -I http://julieguzal.fr` → `301` vers `https://julieguzal.fr/`
- [ ] `curl -I https://www.julieguzal.fr` → `301` vers `https://julieguzal.fr/`
- [ ] `curl -I https://julieguzal.fr/_nuxt/<un-fichier>.js` → `Cache-Control: public, max-age=31536000, immutable`
- [ ] Une URL inexistante → page 404 du site, code `404`
- [ ] Une ancienne URL (`/about`) → `301` vers `/contact`
- [ ] Le contenu correspond à la release (nouveautés du `CHANGELOG.md` visibles)
- [ ] Console du navigateur sans erreur sur la home et une page projet
- [ ] Lighthouse (mobile) sur la home : scores notés, pas de régression par rapport à la release précédente

## 5. Mise à jour du contenu via Prismic

- [ ] Modifier puis publier un document test dans Prismic
- [ ] Netlify → Logs → Functions : appel `run-gh-dispatches` avec réponse `200`
- [ ] GitHub → Actions : run « Deploy prod » déclenché par `repository_dispatch`, vert
- [ ] La modification est visible sur https://julieguzal.fr (rafraîchissement forcé)
- [ ] Remettre le document test dans son état d'origine (nouveau déploiement automatique)

En cas d'échec : `401` = secret différent entre Prismic et Netlify ; `500` = variable Netlify manquante ; `502` = token GitHub expiré ou sans la bonne permission (voir les logs de la fonction).
