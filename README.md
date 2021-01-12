# :globe_with_meridians: vue-cli-plugin-i18n

[![npm](https://img.shields.io/npm/v/vue-cli-plugin-i18n.svg)](https://www.npmjs.com/package/vue-cli-plugin-i18n)
![Test](https://github.com/intlify/vue-cli-plugin-i18n/workflows/Test/badge.svg)
[![vue-cli-plugin-i18n Dev Token](https://badge.devtoken.rocks/vue-cli-plugin-i18n)](https://devtoken.rocks/package/vue-cli-plugin-i18n)

Vue CLI plugin to add vue-i18n to your Vue Project


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

  Wheather enable locale messages in Single file components. Default `No` in propmpt, for Vue 2 and Vue I18n v8.x only.

### `enableLegacy`

- **Type:** `boolean`
- **Default in prompt:** `false`

  Wheather use legacy mode API in Vue I18n. Default `No` in propmpt, for Vue 3 and Vue I18n v9 or later.


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
