# :globe_with_meridians: vue-cli-plugin-i18n

[![npm](https://img.shields.io/npm/v/vue-cli-plugin-i18n.svg)](https://www.npmjs.com/package/vue-cli-plugin-i18n)

Vue CLI 3.x plugin to add vue-i18n to your Vue Project


## :star: Features
- [vue-i18n](https://github.com/kazupon/vue-i18n) basic scaffoling
- Locale messages in Single File components with [vue-i18n-loader](https://github.com/kazupon/vue-i18n-loader)

## :rocket: Getting Started
If yon don't have a project created with Vue CLI 3.x:

```sh
$ vue create my-vue-app
```

Install the plugin into your project:

```sh
$ cd my-vue-app
$ vue add i18n
```

## :wrench: Configrations

`vue-cli-plugin-i18n` have some plugin options in `vue.config.js`:

```js
module.exports = {
  pluginOptions: {
    enalbeInSFC: false // Locale messages in Single file components
  }
}
```

## :scroll: Changelog
Details changes for each release are documented in the [CHANGELOG.md](https://github.com/kazupon/vue-cli-plugin-i18n/blob/dev/CHANGELOG.md).


## :exclamation: Issues
Please make sure to read the [Issue Reporting Checklist](https://github.com/kazupon/vue-cli-plugin-i18n/blob/dev/.github/CONTRIBUTING.md#issue-reporting-guidelines) before opening an issue. Issues not conforming to the guidelines may be closed immediately.


## :muscle: Contribution
Please make sure to read the [Contributing Guide](https://github.com/kazupon/vue-cli-plugin-i18n/blob/dev/.github/CONTRIBUTING.md) before making a pull request.


## :copyright: License

[MIT](http://opensource.org/licenses/MIT)
