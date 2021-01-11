const debug = require('debug')('vue-cli-plugin-i18n:prompts')

module.exports = pkg => {
  const { semver } = require('@vue/cli-shared-utils')
  const vue = require('vue')
  debug('vue version', vue.version)
  const isVue3 = (vue && semver.major(vue.version) === 3)

  const prompts = [
    {
      type: 'input',
      name: 'locale',
      message: 'The locale of project localization.',
      validate: input => !!input,
      default: 'en'
    }, {
      type: 'input',
      name: 'fallbackLocale',
      message: 'The fallback locale of project localization.',
      validate: input => !!input,
      default: 'en'
    }, {
      type: 'input',
      name: 'localeDir',
      message: 'The directory where store localization messages of project. It\'s stored under `src` directory.',
      validate: input => !!input,
      default: 'locales'
    }
  ]

  if (!isVue3) {
    prompts.push({
      type: 'confirm',
      name: 'enableInSFC',
      message: 'Enable locale messages in Single file components ?',
      default: false
    })
  }

  return prompts
}
