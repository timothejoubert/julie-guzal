# Nuxt 3 Prismic starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

--- 

## Prismic stater roadmap

### Init project

```bash
npx nuxi@latest init nuxt-starter-timothe
cd nuxt-starter-timothe
npx prismic init --repo nuxt-starter-timothe
```

Content models are edited in the Prismic Type Builder, then synced locally with the Prismic CLI:

```bash
npx prismic pull       # pull types and slices from Prismic
pnpm type-gen          # regenerate prismicio-types.d.ts
```

### Local setup
* Clone skeleton project [Nuxt | Prismic starter](https://github.com/timothejoubert/nuxt-prismic-skeleton)
* Update .env file from .sample.env (PRISMIC_REPOSITORY_NAME)
* Init Prismic in local (npx prismic init --repo [repo-name])
* Push on your github repo
* Sync models with `npx prismic pull` / `npx prismic push`

### Preprod on netlify
* Login in your Netlify account
* Sync your github repo
* Customize your domain name
* Add your environment variables in "site settings"

### Preview
Not
* Setup preview in prismic setting BO (add name, domain and path to the preview in prismic settings)
* Add the cdn link in header script and the preview path url in nuxt.config.js
```
script: [
    {
        src: `https://static.cdn.prismic.io/prismic.js?new=true&repo=${process.env.PRISMIC_REPOSITORY_NAME}`,
        defer: true,
    },
],
prismic: {
    preview: process.env.PREVIEW_PATH
}
```

### Redirection
* Production is static on Apache: redirects, HTTP headers and cache rules live in `public/.htaccess` (copied to `.output/public` by `nuxi generate`). `nitro.routeRules` are not applied there.

## Production deploy

Production is the statically generated site (`pnpm generate`) uploaded over SFTP to OVH (`/home/juliegd/www`) by `.github/workflows/build-prod.yaml`. The Netlify site (https://staging.julieguzal.fr) is the staging, built from `develop`.

### Triggers

`build-prod.yaml` runs on:

| Trigger | When |
| --- | --- |
| Git tag push | Release (`release/*` merged into `main`, then tagged) |
| `repository_dispatch` `netlify_function_publish_trigger` | A document is published/unpublished in Prismic |
| `repository_dispatch` `custom_bruno_trigger` | Manual run from the Bruno collection (`Github action build`) |

### Prismic publish → production

```
Prismic (publish) ──webhook──▶ Netlify function ──repository_dispatch──▶ GitHub Actions ──SFTP──▶ OVH
                               run-gh-dispatches                        build-prod.yaml
```

Prismic cannot call GitHub directly: its webhook body is fixed (`secret`, `type`, `documents`…) while the GitHub `dispatches` endpoint expects `{ event_type }` and a bearer token. `netlify/functions/run-gh-dispatches.mts` is the relay: it checks the Prismic secret, then dispatches `netlify_function_publish_trigger` (only the document ids are forwarded, never the secret).

It replaces the former standalone repository `timothejoubert/julie-guzal-webhook`, which is obsolete.

- Endpoint: `https://staging.julieguzal.fr/.netlify/functions/run-gh-dispatches` (`POST` only)
- Deployed with the Netlify staging: a change to the function is live only once `develop` is pushed.
- Responses: `200` dispatched · `401` wrong/missing secret · `405` not `POST` · `500` missing env variable · `502` GitHub refused the dispatch (see Netlify function logs).

### Configuration

Values are in Bitwarden, never in the repository.

| Where | Name | Notes |
| --- | --- | --- |
| Netlify env | `NUXT_GITHUB_USER_TOKEN` | Fine-grained PAT, repository `timothejoubert/julie-guzal` only, permission *Contents: read & write* |
| Netlify env | `PRISMIC_WEBHOOK_SECRET` | Same value as the Prismic webhook secret |
| GitHub secrets | `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD` | OVH SFTP access |
| Prismic → Settings → Webhooks | URL + secret | Function endpoint above, triggers on document publish/unpublish |

Release and production checks: see [`RELEASE_CHECKLIST.md`](RELEASE_CHECKLIST.md).

---

## Editorial sticky note

* Set image meta date (alt, copyright, dimension...)
* Set data in document meta tab

#### Project specifications
Tags:
- Project tag are filtered by prefixing with 'Project:' or 'Projet:'
