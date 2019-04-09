# :globe_with_meridians: vue-cli-plugin-i18n

[![npm](https://img.shields.io/npm/v/vue-cli-plugin-i18n.svg)](https://www.npmjs.com/package/vue-cli-plugin-i18n)
[![CircleCI](https://circleci.com/gh/kazupon/vue-cli-plugin-i18n.svg?style=svg)](https://circleci.com/gh/kazupon/vue-cli-plugin-i18n)
[![vue-cli-plugin-i18n Dev Token](https://badge.devtoken.rocks/vue-cli-plugin-i18n)](https://devtoken.rocks/package/vue-cli-plugin-i18n)

Vue CLI 3 plugin to add vue-i18n to your Vue Project

<a href="https://www.patreon.com/kazupon" target="_blank">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patreon">
</a>

## :star: Features
- [vue-i18n](https://github.com/kazupon/vue-i18n) basic scaffolding
- Locale messages in Single File components with [vue-i18n-loader](https://github.com/kazupon/vue-i18n-loader)
- Locale messages missing & unused reporting (experimental)
- Env Variables

## :rocket: Getting Started
If yon don't have a project created with Vue CLI 3:

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
      locale: 'ja',             // The locale of project localization
      fallbackLocale: 'en',     // The fallback locale of project localization
      localeDir: 'locales',     // The directory where store localization messages of project
      enableInSFC: false        // Enable locale messages in Single file components
    }
  }
}
```

See the `prompts.js`.

## :scroll: Changelog
Details changes for each release are documented in the [CHANGELOG.md](https://github.com/kazupon/vue-cli-plugin-i18n/blob/dev/CHANGELOG.md).


## :exclamation: Issues
Please make sure to read the [Issue Reporting Checklist](https://github.com/kazupon/vue-cli-plugin-i18n/blob/dev/.github/CONTRIBUTING.md#issue-reporting-guidelines) before opening an issue. Issues not conforming to the guidelines may be closed immediately.


## :white_check_mark: TODO
Managed with [GitHub Projects](https://github.com/kazupon/vue-cli-plugin-i18n/projects/1)

## :muscle: Contribution
Please make sure to read the [Contributing Guide](https://github.com/kazupon/vue-cli-plugin-i18n/blob/dev/.github/CONTRIBUTING.md) before making a pull request.


## :copyright: License

[MIT](http://opensource.org/licenses/MIT)
