# :globe_with_meridians: vue-cli-plugin-i18n

[![npm](https://img.shields.io/npm/v/vue-cli-plugin-i18n/next.svg)](https://www.npmjs.com/package/vue-cli-plugin-i18n)
[![npm](https://img.shields.io/npm/v/vue-cli-plugin-i18n.svg)](https://www.npmjs.com/package/vue-cli-plugin-i18n)
![Test](https://github.com/intlify/vue-cli-plugin-i18n/workflows/Test/badge.svg)
[![vue-cli-plugin-i18n Dev Token](https://badge.devtoken.rocks/vue-cli-plugin-i18n)](https://devtoken.rocks/package/vue-cli-plugin-i18n)

Vue CLI plugin to add vue-i18n to your Vue Project

<h2 align="center">🤝 Supporting Intlify Project</h2>

Intlify Project is an open source project that is included Vue I18n and i18n tooling and libralies with its ongoing development made possible entirely by the support of Sponsors. If you would like to become a sponsor, please consider:

<p align="center">
  <a
    href="https://github.com/sponsors/kazupon"
    target="_blank">
    Become a Sponsor on GitHub
  </a>
</p>

<h3 align="center">🥇 Gold Sponsors</h3>

<p align="center">
  <a
    href="https://nuxtjs.org/"
    target="_blank">
    <img
      src="https://raw.githubusercontent.com/intlify/vue-i18n-next/master/docs/public/nuxt.png"
      width="240px"
    />
  </a>
</p>

<h3 align="center">🥈 Silver Sponsors</h3>

<p align="center">
  <a
    href="https://www.codeandweb.com/babeledit?utm_campaign=vue-i18n-2019-01" 
    target="_blank">
    <img
      src="https://secure.codeandweb.com/static/babeledit.svg"
      width="200px"
    />
  </a>
</p>

<h3 align="center">🥉 Bronze Sponsors</h3>

<p align="center">
  <a href="https://zenarchitects.co.jp/" target="_blank">
    <img
      src="https://raw.githubusercontent.com/intlify/vue-i18n-next/master/docs/public/zenarchitects.png"
      width="144px"
    />
  </a>
</p>
<p align="center">
  <a href="https://www.sendcloud.com/" target="_blank">
    <img
      src="https://raw.githubusercontent.com/intlify/vue-i18n-next/master/docs/public/sendcloud.png"
      width="144px"
    />
  </a>
</p>
<p align="center">
  <a href="https://www.vuemastery.com/" target="_blank">
    <img
      src="https://raw.githubusercontent.com/intlify/vue-i18n-next/master/docs/public/vuemastery.png"
      width="144px"
    />
  </a>
</p>

<br/>

## :star: Features
- [vue-i18n](https://github.com/kazupon/vue-i18n) basic scaffolding
- Locale messages in Single File components with [vue-i18n-loader](https://github.com/intlify/vue-i18n-loader)
- Locale messages missing & unused reporting (experimental)
- Env Variables


## :rocket: Getting Started
If yon don't have a project created with Vue CLI:

```sh
vue create my-vue-app
```

Install the plugin into your project:

```sh
cd my-vue-app
vue add i18n
```

## :hammer: Injected Commands
- **`vue-cli-service i18n:report`** (experimental)

  Report the missing locale message keys and unused keys.

> NOTE: limitation
> `vue-cli-service i18n:report` cannot detect missing and unused keys from local messages of i18n custom blocks.


## :clipboard: Env variables
When vue-i18n code files had been scaffolded into your project, the following env variables generate into `.env`:

- **`VUE_APP_I18N_LOCALE`**

  The locale of project localization, default `en`.

- **`VUE_APP_I18N_FALLBACK_LOCALE`**

  The locale of project fallback localization, default `en`.

These env variables are read in `src/i18n.(js|ts)`.


## :wrench: Configrations

`vue-cli-plugin-i18n` have some plugin options in `vue.config.js`:

```js
module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'ja',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
      enableLegacy: false
    }
  }
}
```

### `locale`

- **Type:** `string`
- **Default in prompt:** `en`

  The locale of project localization.

### `fallbackLocale`

- **Type:** `string`
- **Default in prompt:** `en`

  The fallback locale of project localization.

### `localeDir`

- **Type:** `string`
- **Default in prompt:** `locales`

  The directory where store localization messages of project. The specified directory will start from the `src` directory.

### `enableInSFC`

- **Type:** `boolean`
- **Default in prompt:** `false`
- **Support project Vue version:** Vue 2 only

  Wheather enable locale messages in Single file components. Default `No` in propmpt, for Vue 2 and Vue I18n v8.x only.

### `enableLegacy`

- **Type:** `boolean`
- **Default in prompt:** `false`
- **Support project Vue version:** Vue 3 only

  Wheather use legacy mode API in Vue I18n. Default `No` in propmpt, for Vue 3 and Vue I18n v9 or later.

### `runtimeOnly`
- **Type:** `boolean`
- **Default(No Prompt):** `false`
- **Support project Vue version:** Vue 3 only

  Whether or not to use Vue I18n **runtime-only**, set in the `vue-i18n` field of webpack `resolve.alias` option. default Vue I18n (vue-i18n) package.json `module` field will be used.
  If `true` is specified, Vue I18n (vue-i18n) will use `node_modules/vue-i18n/dist/vue-i18n.runtime.esm-bundler.js`.

  For more details, See [here](https://vue-i18n.intlify.dev/guide/advanced/optimization.html#reduce-bundle-size-with-feature-build-flags)

### `compositionOnly`

- **Type:** `boolean`
- **Default(No Prompt):** if `enableLegacy` set `false`, `true` else then `false`
- **Support project Vue version:** Vue 3 only

  Whether to make vue-i18n's API only composition API. **By default the legacy API is tree-shaken.**

  For more details, See [here](https://vue-i18n.intlify.dev/guide/advanced/optimization.html#reduce-bundle-size-with-feature-build-flags)

### `fullInstall`

- **Type:** `boolean`
- **Default(No Prompt):** `true`
- **Support project Vue version:** Vue 3 only

  Whether to install the full set of APIs, components, etc. provided by Vue I18n. By default, all of them will be installed.

  If `false` is specified, **buld-in components and directive will not be installed in vue and will be tree-shaken.**

  For more details, See [here](https://vue-i18n.intlify.dev/guide/advanced/optimization.html#reduce-bundle-size-with-feature-build-flags)


## :scroll: Changelog
Details changes for each release are documented in the [CHANGELOG.md](https://github.com/intlify/vue-cli-plugin-i18n/blob/master/CHANGELOG.md).


## :exclamation: Issues
Please make sure to read the [Issue Reporting Checklist](https://github.com/intlify/vue-cli-plugin-i18n/blob/master/.github/CONTRIBUTING.md#issue-reporting-guidelines) before opening an issue. Issues not conforming to the guidelines may be closed immediately.


## :white_check_mark: TODO
Managed with [GitHub Projects](https://github.com/intlify/vue-cli-plugin-i18n/projects/1)

## :muscle: Contribution
Please make sure to read the [Contributing Guide](https://github.com/intlify/vue-cli-plugin-i18n/blob/master/.github/CONTRIBUTING.md) before making a pull request.


## :copyright: License

[MIT](http://opensource.org/licenses/MIT)
