# Nuxt 3 Prismic starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

--- 

## Prismic stater roadmap

### Init project

```bash
npx nuxi@latest init nuxt-starter-timothe
cd nuxt-starter-timothe
npx @slicemachine/init@latest --repository nuxt-starter-timothe
npm run slicemachine
```

### Local setup
* Clone skeleton project [Nuxt | Prismic starter](https://github.com/timothejoubert/nuxt-prismic-skeleton)
* Update .env file from .sample.env (PRISMIC_REPOSITORY_NAME)
* Init Slice machine in local (npx @slicemachine/init@latest --repository [repo-name])
* Push on your github repo
* Sync slice_model data on prismic repo from local slice machine

### Preprod on netlify
* Login in your Netlify account
* Sync your github repo
* Customize your domain name
* Add your environment variables in "site settings"

### Webhook
If you are creating a Static Website:  
Use Prismic webhook for rebuild the app each time Prismic data is updated. [Prismic tuto](https://prismic.io/docs/webhooks) | [Netlify build hook page](https://app.netlify.com/sites/hugo-tomasi/settings/deploys#build-hooks)


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
* Create netlify.toml file in static folder with specific rules [Netlify tuto](https://docs.netlify.com/routing/redirects/)

---

## Editorial sticky note

* Set image meta date (alt, copyright, dimension...)
* Set data in document meta tab

#### Project specifications
Tags:
- Project tag are filtered by prefixing with 'Project:' or 'Projet:'
