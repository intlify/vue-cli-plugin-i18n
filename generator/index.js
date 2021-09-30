const debug = require('debug')('vue-cli-plugin-i18n:generator')
const {
  checkInstalled,
  exists,
  writeFile,
  readEnv,
  buildEnvContent
} = require('../utils')
const chalk = require(require.resolve('chalk'))

module.exports = (api, options, rootOptions) => {
  const {
    locale,
    fallbackLocale,
    localeDir,
    enableLegacy,
    enableInSFC,
    enableBridge
  } = options
  debug('options', options)
  debug('rootOptions', rootOptions)
  const isVue3 = rootOptions && rootOptions.vueVersion === '3'

  try {
    const lang = api.hasPlugin('typescript') ? 'ts' : 'js'
    const classComponent =
      checkInstalled('./node_modules/vue-class-component/package.json') &&
      checkInstalled('./node_modules/vue-property-decorator/package.json')
    const additionalOptions = {
      ...options,
      ...{ lang, localeDir, classComponent, enableLegacy }
    }
    debug('additionalOptions', additionalOptions)

    /*
     * extend packages
     */

    const pkg = {
      scripts: {
        'i18n:report': `vue-cli-service i18n:report --src "./src/**/*.?(js|vue)" --locales "${`./src/${localeDir}/**/*.json`}"`
      },
      dependencies: {},
      devDependencies: {},
      vue: {
        pluginOptions: {
          i18n: {
            locale,
            fallbackLocale,
            localeDir
          }
        }
      }
    }

    if (isVue3) {
      pkg.dependencies['vue-i18n'] = '^9.1.0'
      pkg.devDependencies['@intlify/vue-i18n-loader'] = '^3.0.0'
      pkg.vue.pluginOptions.i18n['enableLegacy'] = enableLegacy
      pkg.vue.pluginOptions.i18n['runtimeOnly'] = false
      pkg.vue.pluginOptions.i18n['compositionOnly'] = !!enableLegacy
      pkg.vue.pluginOptions.i18n['fullInstall'] = true
    } else {
      pkg.dependencies['vue-i18n'] = '^8.26.3'
      if (enableInSFC) {
        pkg.devDependencies['@intlify/vue-i18n-loader'] = '^1.1.0'
      }
      pkg.vue.pluginOptions.i18n['enableInSFC'] = enableInSFC
      if (enableBridge) {
        pkg.devDependencies['@intlify/vue-i18n-loader'] = '^3.2.0'
        pkg.dependencies['vue-i18n-bridge'] = '^9.2.0-beta.10'
        pkg.vue.pluginOptions.i18n['includeLocales'] = false
      }
      pkg.vue.pluginOptions.i18n['enableBridge'] = enableBridge
    }
    debug('pkg', pkg)

    api.extendPackage(pkg)

    /*
     * Modify entry file
     */

    api.injectImports(api.entryFile, `import i18n from './i18n'`)
    if (isVue3) {
      api.transformScript(api.entryFile, require('./injectUseI18n'))
    } else {
      api.injectRootOptions(api.entryFile, `i18n,`)
    }

    /*
     * render templates
     */

    const renderOptions = { ...additionalOptions }

    // i18n templates for program language
    if (isVue3) {
      api.render(`./templates-vue3/${lang}`, renderOptions)
    } else {
      api.render(`./templates/${lang}`, renderOptions)
    }

    // locale messages
    const defaultLocaleMessages = JSON.stringify(
      {
        message: 'hello i18n !!'
      },
      null,
      2
    )
    api.render((files, render) => {
      files[`src/${localeDir}/${locale}.json`] = render(
        defaultLocaleMessages,
        renderOptions
      )
    })

    // locale messages in SFC examples
    if (isVue3) {
      if (enableLegacy) {
        api.render('./templates-vue3/sfc/legacy', renderOptions)
      } else {
        api.render('./templates-vue3/sfc/composition', renderOptions)
      }
    } else {
      if (enableInSFC) {
        api.render('./templates/sfc', renderOptions)
      }
    }
  } catch (e) {
    api.exitLog(
      `unexpected error in vue-cli-plugin-i18n: ${e.message}`,
      'error'
    )
    return
  }

  api.onCreateComplete(() => {
    debug('onCreateComplete called')
    const envPath = api.resolve('.env')
    const envVars = exists(envPath) ? readEnv(envPath) : {}

    if (envVars['VUE_APP_I18N_LOCALE']) {
      api.exitLog(`overwrite VUE_APP_I18N_LOCALE at ${envPath}`, 'info')
    }
    envVars['VUE_APP_I18N_LOCALE'] = locale

    if (envVars['VUE_APP_I18N_FALLBACK_LOCALE']) {
      api.exitLog(
        `overwrite VUE_APP_I18N_FALLBACK_LOCALE at ${envPath}`,
        'info'
      )
    }
    envVars['VUE_APP_I18N_FALLBACK_LOCALE'] = fallbackLocale

    if (!writeFile(envPath, buildEnvContent(envVars))) {
      api.exitLog(`cannot write to ${envPath}`, 'error')
      return
    }

    if (
      enableBridge &&
      checkInstalled('./node_modules/@vue/composition-api/package.json')
    ) {
      api.exitLog(
        chalk.yellow.underline(
          `You need to install '@vue/composition-api' https://github.com/vuejs/composition-api`
        )
      )
    }
  })
}
