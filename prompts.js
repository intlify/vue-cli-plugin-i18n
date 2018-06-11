module.exports = [{
  type: 'input',
  name: 'locale',
  message: 'The locale of project localization.',
  validate: input => !!input,
  default: 'en'
}, {
  type: 'input',
  name: 'fallbackLocale',
  message: 'The locale of project fallback localization.',
  validate: input => !!input,
  default: 'en'
}, {
  type: 'confirm',
  name: 'enableInSFC',
  message: 'Enable locale messages in Single file components ?',
  default: false
}]
