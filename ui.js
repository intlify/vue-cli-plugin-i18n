const debug = require('debug')('vue-cli-plugin-i18n')
const fs = require('fs')
const path = require('path')
const deepmerge = require('deepmerge')
const flatten = require('flat')
const unflatten = require('flat').unflatten
const {
  isObject,
  readEnv,
  buildEnvContent,
  writeFile,
  sortObject
} = require('./utils')
const i18n = require('./i18n')

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
  return fs.readdirSync(targetPath)
    .filter(locale => {
      const stat = fs.statSync(path.join(targetPath, locale))
      return stat.isFile() && path.extname(locale) === '.json'
    })
    .map(locale => {
      return path.basename(locale, '.json')
    })
}

function getLocaleMessages (targetPath, locales) {
  debug('getLocaleMessages', targetPath, locales)
  return locales.reduce((val, locale) => {
    const fullPath = `${targetPath}/${locale}.json`
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
    `${targetPath}/${locale}.json`,
    JSON.stringify(sortedMessages, null, 2), { encoding: 'utf8' }
  )
}

module.exports = api => {
  const { getSharedData, setSharedData, watchSharedData } = api.namespace('org.kazupon.vue-i18n.')
  let clientLocale = 'en'

  function setupAddon (path, options) {
    debug(`setupAddon: path -> ${path}, options -> ${options}`)
    const localeDir = options.localeDir
    setSharedData('order', 'asc')
    const env = readEnv(`${path}/.env`)
    const current = env['VUE_APP_I18N_LOCALE'] || 'en'
    const defaultLocale = env['VUE_APP_I18N_FALLBACK_LOCALE'] || 'en'
    setSharedData('current', defaultLocale)
    setSharedData('defaultLocale', defaultLocale)
    debug(`setupAddon: current -> ${current}, defaultLocale -> ${defaultLocale}`)
    const locales = getLocales(`${path}/src/${localeDir}`)
    setSharedData('locales', locales)
    const messages = getLocaleMessages(`${path}/src/${localeDir}`, locales)
    setSharedData('localeMessages', messages)
    setSharedData('localePaths', getLocalePaths(messages))
  }

  function setupProject (project, eventName) {
    const rawConfig = require(`${project.path}/vue.config`)
    const config = (rawConfig.pluginOptions && rawConfig.pluginOptions.i18n)
      ? rawConfig.pluginOptions.i18n
      : { localeDir: 'locales' }
    if (!config.localeDir) { config.localeDir = 'locales' }
    debug(`${eventName}: load vue.config`, config)
    setupAddon(project.path, config)
    return config
  }

  try {
    let currentProject = null
    let currentConfig = null

    api.onProjectOpen((project, previousProject) => {
      debug('onProjectOpen', project, previousProject)
      currentConfig = setupProject(project, 'onProjectOpen')
      currentProject = project
    })

    api.onPluginReload(project => {
      debug('onPluginReload', project)
      currentConfig = setupProject(project, 'onPluginReload')
      currentProject = project
    })

    api.onAction('add-path-action', ({ path, locale }) => {
      debug('add-path-action onAction', path, locale)
      if (!currentProject || !currentConfig || !path) {
        console.error('add-path-action: invalid pre-condition !!')
        return
      }

      const localePath = `${currentProject.path}/src/${currentConfig.localeDir}`
      const orderData = getSharedData('order')
      const locales = getLocales(localePath)
      const messages = getLocaleMessages(localePath, locales)

      locales.forEach(locale => {
        const additional = {}
        additional[path] = '' // set default
        const original = messages[locale]
        debug('original', original)
        debug('additional', additional)
        const message = deepmerge(original, unflatten(additional))
        debug('merged', message)
        writeLocaleMessages(localePath, locale, message, orderData.value)
        messages[locale] = message
      })

      setSharedData('localeMessages', messages)
      setSharedData('localePaths', getLocalePaths(messages))
    })

    api.onAction('update-path-action', ({ path, old, locale }) => {
      debug('update-path-action onAction', path, old, locale)
      if (!currentProject || !currentConfig || !path || !old) {
        console.error('update-path-action: invalid pre-condition !!')
        return
      }

      const localePath = `${currentProject.path}/src/${currentConfig.localeDir}`
      const locales = getLocales(localePath)
      const messages = getLocaleMessages(localePath, locales)
      const orderData = getSharedData('order')

      const original = messages[locale]
      const oldValues = getValuesFromPath(old, original)
      const flattendOriginal = flatten(original)
      delete flattendOriginal[old]
      const newMessage = unflatten(flattendOriginal)
      assignValuesWithPath(path, oldValues, newMessage)
      writeLocaleMessages(localePath, locale, newMessage, orderData.value)
      messages[locale] = newMessage
      setSharedData('localeMessages', messages)
      setSharedData('localePaths', getLocalePaths(messages))
    })

    api.onAction('delete-path-action', ({ path, locale }) => {
      debug('delete-path-action onAction', path, locale)
      if (!currentProject || !currentConfig || !path) {
        console.log('delete-path-action: invalid pre-condition')
        return
      }

      const localePath = `${currentProject.path}/src/${currentConfig.localeDir}`
      const locales = getLocales(localePath)
      const messages = getLocaleMessages(localePath, locales)
      const orderData = getSharedData('order')

      const message = messages[locale]
      const flattendMessage = flatten(message)
      delete flattendMessage[path]
      messages[locale] = unflatten(flattendMessage)
      const ret = writeLocaleMessages(localePath, locale, messages[locale], orderData.value)
      debug('write data', ret)

      setSharedData('localeMessages', messages)
      setSharedData('localePaths', getLocalePaths(messages))
    })

    api.onAction('edit-message-action', ({ path, value, locale }) => {
      debug('edit-message-action onAction', path, value, locale)
      if (!currentProject || !currentConfig || !path) {
        console.error('edit-message-action: invalid pre-condition !!')
        return
      }

      const localePath = `${currentProject.path}/src/${currentConfig.localeDir}`
      const locales = getLocales(localePath)
      const localeMessages = getLocaleMessages(localePath, locales)
      const orderData = getSharedData('order')

      const messages = localeMessages[locale]
      const flattendMessage = flatten(messages)
      flattendMessage[path] = value
      localeMessages[locale] = unflatten(flattendMessage)
      writeLocaleMessages(localePath, locale, localeMessages[locale], orderData.value)

      setSharedData('localeMessages', localeMessages)
      setSharedData('localePaths', getLocalePaths(localeMessages))
    })

    api.onAction('add-locale-action', ({ locale }) => {
      debug('add-locale-action onAction', locale)
      if (!currentProject || !currentConfig || !locale) {
        console.error('add-locale-action: invalid pre-condition')
        return
      }

      const localePath = `${currentProject.path}/src/${currentConfig.localeDir}`
      const defaultLocaleData = getSharedData('defaultLocale')
      const defaultLocale = defaultLocaleData.value
      const oldMessages = getLocaleMessages(localePath, getLocales(localePath))
      const orderData = getSharedData('order')

      const oldFlattendMessages = flatten(oldMessages[defaultLocale])
      const newLocaleMessages = Object.keys(oldFlattendMessages).reduce((val, p) => {
        val[p] = oldFlattendMessages[p]
        return val
      }, {})
      writeLocaleMessages(localePath, locale, unflatten(newLocaleMessages), orderData.value)

      const locales = getLocales(localePath)
      const messages = getLocaleMessages(localePath, locales)
      setSharedData('localeMessages', messages)
      setSharedData('localePaths', getLocalePaths(messages))
      setSharedData('locales', locales)
      setSharedData('current', locale)

      debug('add-locale-action: clientLocale', clientLocale)
      api.notify({
        title: i18n.t('org.kazupon.vue-i18n.notification.title', clientLocale),
        message: i18n.t('org.kazupon.vue-i18n.notification.message', clientLocale, { locale }),
        icon: 'done'
      })
    })

    api.describeConfig({
      id: 'org.kazupon.vue-i18n.config',
      name: 'Vue I18n',
      description: 'org.kazupon.vue-i18n.config.description',
      icon: '/_plugin/vue-cli-plugin-i18n/nav-logo.svg',
      onRead: ({ data, cwd }) => {
        const env = readEnv(`${cwd}/.env`)
        const currentLocale = env['VUE_APP_I18N_LOCALE']
        const defaultLocale = env['VUE_APP_I18N_FALLBACK_LOCALE']
        debug('onRead', data, clientLocale, currentLocale, defaultLocale)
        return {
          prompts: [{
            type: 'input',
            name: 'locale',
            message: 'org.kazupon.vue-i18n.config.prompts.locale.message',
            description: 'org.kazupon.vue-i18n.config.prompts.locale.description',
            value: currentLocale || 'en'
          }, {
            type: 'input',
            name: 'fallbackLocale',
            message: 'org.kazupon.vue-i18n.config.prompts.fallbackLocale.message',
            description: 'org.kazupon.vue-i18n.config.prompts.fallbackLocale.description',
            value: defaultLocale || 'en'
          }]
        }
      },
      onWrite: ({ answers, data, cwd }) => {
        debug('onWrite', cwd, answers, data)
        const envPath = `${cwd}/.env`
        const env = readEnv(envPath)
        const { locale, fallbackLocale } = answers
        env['VUE_APP_I18N_LOCALE'] = locale
        env['VUE_APP_I18N_FALLBACK_LOCALE'] = fallbackLocale
        if (!writeFile(envPath, buildEnvContent(env))) {
          console.error('onWrite: failed env variables')
        }
      }
    })

    api.describeTask({
      match: /vue-cli-service i18n:report/,
      description: 'org.kazupon.vue-i18n.task.report.description',
      icon: '/_plugin/vue-cli-plugin-i18n/nav-logo.svg',
      prompts: [{
        name: 'type',
        description: 'org.kazupon.vue-i18n.task.report.prompts.type',
        type: 'list',
        default: 'missing & unused',
        choices: [{
          name: 'missing & unused',
          value: 'missing & unused'
        }, {
          name: 'missing',
          value: 'missing'
        }, {
          name: 'unused',
          value: 'unused'
        }]
      }, {
        name: 'output',
        description: 'org.kazupon.vue-i18n.task.report.prompts.output',
        type: 'input'
      }],
      onBeforeRun: async ({ answers, args }) => {
       if (answers.type && answers.type !== 'missing & unused') {
         args.push('--type', answers.type)
       }
       if (answers.output) {
         args.push('--output', answers.output)
       }
      },
    })

    api.addView({
      id: 'org.kazupon.vue-i18n.views.entry',
      name: 'org.kazupon.vue-i18n.routes.entry',
      // icon: 'pets',
      icon: '/_plugin/vue-cli-plugin-i18n/nav-logo.svg',
      tooltip: 'org.kazupon.vue-i18n.tooltip'
    })

    const clientAddonOptions = { id: 'org.kazupon.vue-i18n.client-addon' }
    if (!process.env.VUE_I18N_UI_DEV) {
      clientAddonOptions['path'] = path.resolve(__dirname, './client-addon-dist')
    } else {
      clientAddonOptions['url'] = 'http://localhost:8043/index.js'
    }
    debug('clientAddonOptions', clientAddonOptions)

    api.addClientAddon(clientAddonOptions)
  } catch (e) {
    console.error('unexpted error', e.message)
  }

  watchSharedData('current', (val, old) => {
    debug('watch `current`:', val, old)
  })

  watchSharedData('clientLocale', (val, old) => {
    debug('watch `clientLocale`:', val, old)
    clientLocale = val
  })
}
