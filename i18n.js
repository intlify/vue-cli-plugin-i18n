const debug = require('debug')('vue-cli-plugin-i18n')
const fs = require('fs')
const path = require('path')
const Vue = require('vue')
const VueI18n = require('vue-i18n')

Vue.use(VueI18n)

function loadLocaleMessages () {
  const targetPath = path.resolve(__dirname, './client-addon/src/locales')
  const locales = fs.readdirSync(targetPath).map(locale => {
    return path.basename(locale, '.json')
  })
  debug('loadLocaleMessage(UI) locales:', locales)

  const messages = locales.reduce((val, locale) => {
    const fullPath = `${targetPath}/${locale}.json`
    val[locale] = require(fullPath)
    return val
  }, {})
  debug('loadLocaleMessage(UI) messages:', messages)

  return messages
}

module.exports = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: loadLocaleMessages()
})
