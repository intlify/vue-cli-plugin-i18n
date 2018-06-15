const debug = require('debug')('vue-cli-plugin-i18n')
const fs = require('fs')
const path = require('path')
const deepmerge = require('deepmerge')
const flatten = require('flat')
const unflatten = require('flat').unflatten
const { isObject, readEnv, sortObject } = require('./utils')

function getValuesFromPath (path, messages) {
  const paths = path.split('.')
  let p = null
  let target = messages
  while ((p = paths.shift())) {
    target = target[p]
    if (!(isObject(target) || Array.isArray(target))) { break }
  }
  debug('getValuesFromPath', path, target)
  return target
}

function assignValuesWithPath (path, value, messages) {
  const paths = path.split('.')
  let p = null
  let target = messages
  while ((p = paths.shift())) {
    if (paths.length > 0) {
      target = target[p]
      if (target === undefined) {
        target[p] = target = {}
      }
    } else {
      target[p] = value
    }
  }
  debug('assignValuesToPath', path, value, messages)
}

function getLocales (targetPath) {
  debug('getLocales', targetPath)
  return fs.readdirSync(`${targetPath}/src/locales`).map(locale => {
    return path.basename(locale, '.json')
  })
}

function getLocaleMessages (targetPath, locales) {
  debug('getLocaleMessages', targetPath, locales)
  return locales.reduce((val, locale) => {
    const fullPath = `${targetPath}/src/locales/${locale}.json`
    val[locale] = require(fullPath)
    delete require.cache[require.resolve(fullPath)]
    return val
  }, {})
}

function getLocalePaths (messages) {
  debug('getLocalePaths', messages)
  return Object.keys(messages).reduce((paths, locale) => {
    paths[locale] = Object.keys(flatten(messages[locale]))
    return paths
  }, {})
}

function writeLocaleMessages (targetPath, locale, messages, order) {
  debug('writeLocaleMessages', targetPath, locale, messages, order)
  const sortedMessages = sortObject(messages, order)
  debug('writeLocaleMessages after:', sortedMessages)
  return fs.writeFileSync(
    `${targetPath}/src/locales/${locale}.json`,
    JSON.stringify(sortedMessages, null, 2), { encoding: 'utf8' }
  )
}

module.exports = api => {
  const { getSharedData, setSharedData, watchSharedData } = api.namespace('vue-i18n-')

  function setupAddon (path) {
    debug(`setupAddon: path -> ${path}`)
    setSharedData('order', 'asc')
    const env = readEnv(`${path}/.env`)
    const current = env['VUE_APP_I18N_LOCALE'] || 'en'
    const defaultLocale = env['VUE_APP_I18N_FALLBACK_LOCALE'] || 'en'
    setSharedData('current', defaultLocale)
    setSharedData('defaultLocale', defaultLocale)
    debug(`setupAddon: current -> ${current}, defaultLocale -> ${defaultLocale}`)
    const locales = getLocales(path)
    setSharedData('locales', locales)
    const messages = getLocaleMessages(path, locales)
    setSharedData('localeMessages', messages)
    setSharedData('localePaths', getLocalePaths(messages))
  }

  try {
    let currentProject = null

    api.onProjectOpen((project, previousProject) => {
      debug('onProjectOpen', project, previousProject)
    })

    api.onPluginReload(project => {
      debug('onPluginReload', project)
      setupAddon(project.path)
      currentProject = project
    })

    api.onAction('add-path-action', ({ path, locale }) => {
      debug('add-path-action onAction', path, locale)
      if (!currentProject && !path) {
        console.error('add-path-action: invalid pre-condition !!')
        return
      }

      const locales = getLocales(currentProject.path)
      const messages = getLocaleMessages(currentProject.path, locales)
      const orderData = getSharedData('order')

      const additional = {}
      additional[path] = '' // set default
      const original = messages[locale]
      debug('original', original)
      debug('additional', additional)
      const message = deepmerge(original, unflatten(additional))
      debug('merged', message)
      writeLocaleMessages(currentProject.path, locale, message, orderData.value)
      messages[locale] = message
      setSharedData('localeMessages', messages)
      setSharedData('localePaths', getLocalePaths(messages))
    })

    api.onAction('update-path-action', ({ path, old, locale }) => {
      debug('update-path-action onAction', path, old, locale)
      if (!currentProject && !path && !old) {
        console.error('update-path-action: invalid pre-condition !!')
        return
      }

      const locales = getLocales(currentProject.path)
      const messages = getLocaleMessages(currentProject.path, locales)
      const orderData = getSharedData('order')

      const original = messages[locale]
      const oldValues = getValuesFromPath(old, original)
      const flattendOriginal = flatten(original)
      delete flattendOriginal[old]
      const newMessage = unflatten(flattendOriginal)
      assignValuesWithPath(path, oldValues, newMessage)
      writeLocaleMessages(currentProject.path, locale, newMessage, orderData.value)
      messages[locale] = newMessage
      setSharedData('localeMessages', messages)
      setSharedData('localePaths', getLocalePaths(messages))
    })

    api.onAction('delete-path-action', ({ path, locale }) => {
      debug('delete-path-action onAction', path, locale)
      if (!currentProject && !path) {
        console.log('delete-path-action: invalid pre-condition')
        return
      }

      const locales = getLocales(currentProject.path)
      const messages = getLocaleMessages(currentProject.path, locales)
      const orderData = getSharedData('order')

      const message = messages[locale]
      const flattendMessage = flatten(message)
      delete flattendMessage[path]
      messages[locale] = unflatten(flattendMessage)
      const ret = writeLocaleMessages(currentProject.path, locale, messages[locale], orderData.value)
      debug('write data', ret)

      setSharedData('localeMessages', messages)
      setSharedData('localePaths', getLocalePaths(messages))
    })

    api.onAction('edit-message-action', ({ path, value, locale }) => {
      debug('edit-message-action onAction', path, value, locale)
      if (!currentProject && !path) {
        console.error('edit-message-action: invalid pre-condition !!')
        return
      }

      const locales = getLocales(currentProject.path)
      const localeMessages = getLocaleMessages(currentProject.path, locales)
      const orderData = getSharedData('order')

      const messages = localeMessages[locale]
      const flattendMessage = flatten(messages)
      flattendMessage[path] = value
      localeMessages[locale] = unflatten(flattendMessage)
      writeLocaleMessages(currentProject.path, locale, localeMessages[locale], orderData.value)

      setSharedData('localeMessages', localeMessages)
      setSharedData('localePaths', getLocalePaths(localeMessages))
    })

    api.onAction('add-locale-action', ({ locale }) => {
      debug('add-locale-action onAction', locale)
      if (!currentProject && !locale) {
        console.error('add-locale-action: invalid pre-condition')
        return
      }

      const defaultLocaleData = getSharedData('defaultLocale')
      const defaultLocale = defaultLocaleData.value
      const oldMessages = getLocaleMessages(currentProject.path, getLocales(currentProject.path))
      const orderData = getSharedData('order')

      const oldFlattendMessages = flatten(oldMessages[defaultLocale])
      const newLocaleMessages = Object.keys(oldFlattendMessages).reduce((val, p) => {
        val[p] = oldFlattendMessages[p]
        return val
      }, {})
      writeLocaleMessages(currentProject.path, locale, unflatten(newLocaleMessages), orderData.value)

      const locales = getLocales(currentProject.path)
      const messages = getLocaleMessages(currentProject.path, locales)
      setSharedData('localeMessages', messages)
      setSharedData('localePaths', getLocalePaths(messages))
      setSharedData('locales', locales)
      setSharedData('current', locale)
    })

    api.addView({
      id: 'vue-i18n-entry-view',
      name: 'vue-i18n-entry',
      // icon: 'pets',
      icon: '/_plugin/vue-cli-plugin-i18n/nav-logo.svg',
      tooltip: 'Localizations'
    })

    api.addClientAddon({
      id: 'vue-i18n',
      path: path.resolve(__dirname, './client-addon-dist')
      //url: 'http://localhost:8043/index.js'
    })
  } catch (e) {
    console.error('unexpted error', e.message)
  }

  watchSharedData('current', (val, old) => {
    debug('watch `current`:', val, old)
  })
}
