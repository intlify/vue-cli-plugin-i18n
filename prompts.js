const debug = require('debug')('vue-cli-plugin-i18n:prompts')

module.exports = pkg => {
  const { semver } = require(require.resolve('@vue/cli-shared-utils'))
  const version = semver.minVersion(pkg.dependencies.vue)
  debug('vue version', version)
  const isVue3 = version.major === 3

  const prompts = [
    {
      type: 'input',
      name: 'locale',
      message: 'The locale of project localization.',
      validate: input => !!input,
      default: 'en'
    },
    {
      type: 'input',
      name: 'fallbackLocale',
      message: 'The fallback locale of project localization.',
      validate: input => !!input,
      default: 'en'
    },
    {
      type: 'input',
      name: 'localeDir',
      message:
        "The directory where store localization messages of project. It's stored under `src` directory.",
      validate: input => !!input,
      default: 'locales'
    }
  ]

  if (isVue3) {
    prompts.push({
      type: 'confirm',
      name: 'enableLegacy',
      message: 'Enable legacy API (compatible vue-i18n@v8.x) mode ?',
      default: false
    })
  } else {
    prompts.push({
      type: 'confirm',
      name: 'enableInSFC',
      message: 'Enable locale messages in Single file components ?',
      default: false
    })
    prompts.push({
      type: 'confirm',
      name: 'enableBridge',
      message:
        'Whether to set up a birdge to migrate to vue-i18n@v9.x from vue-i18n@v8.26',
      default: false
    })
  }

  debug('prompts', prompts)
  return prompts
}
