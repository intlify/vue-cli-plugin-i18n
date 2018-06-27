module.exports = [{
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
}, {
  type: 'confirm',
  name: 'enableInSFC',
  message: 'Enable locale messages in Single file components ?',
  default: false
}]
