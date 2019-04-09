const debug = require('debug')('vue-cli-plugin-i18n:generator')
const {
  checkInstalled,
  exists,
  mkdir,
  writeFile,
  readEnv,
  buildEnvContent
} = require('../utils')

module.exports = (api, options, rootOptions) => {
  const { locale, fallbackLocale, localeDir, enableInSFC } = options
  debug('options', options)
  debug('rootOptions', rootOptions)

  try {
    const lang = api.hasPlugin('typescript') ? 'ts' : 'js'
    const classComponent = checkInstalled('./node_modules/vue-class-component/package.json') &&
      checkInstalled('./node_modules/vue-property-decorator/package.json')
    const additionalOptions = { ...options, ...{ lang, localeDir, classComponent } }
    debug('additionalOptions', additionalOptions)

    /*
     * extend packages
     */

    const pkg = {
      scripts: {
        'i18n:report': `vue-cli-service i18n:report --src './src/**/*.?(js|vue)' --locales '${`./src/${localeDir}/**/*.json`}'`
      },
      dependencies: {
        'vue-i18n': '^8.0.0'
      },
      vue: {
        pluginOptions: {
          i18n: {
            locale, fallbackLocale, localeDir, enableInSFC
          }
        }
      }
    }

    if (enableInSFC) {
      pkg.devDependencies = {
        '@kazupon/vue-i18n-loader': '^0.3.0'
      }
    }

    if (lang === 'ts') {
      const devTsDependencies = {}
      if (!checkInstalled('./node_modules/@types/webpack/package.json')) {
        devTsDependencies['@types/webpack'] = '^4.4.0'
      }
      pkg.devDependencies = { ...pkg.devDependencies, ...devTsDependencies }
    }
    debug('pkg', pkg)

    api.extendPackage(pkg)

    /*
     * Modify main.(js|ts)
     */
    const file = lang === 'ts' ? 'src/main.ts' : 'src/main.js'
    debug('target file', file)
    api.injectImports(file, `import i18n from './i18n'`)
    api.injectRootOptions(file, `i18n,`)

    /*
     * render templates
     */

    // i18n templates for program language
    api.render(`./templates/${lang}`, { ...additionalOptions })

    // locale messages in SFC examples
    if (enableInSFC) {
      api.render('./templates/sfc', { ...additionalOptions })
    }
  } catch (e) {
    api.exitLog(`unexpected error in vue-cli-plugin-i18n: ${e.message}`, 'error')
    return
  }

  api.onCreateComplete(() => {
    debug('onCreateComplete called')
    const defaultLocaleMessages = JSON.stringify({
      message: 'hello i18n !!'
    }, null, 2)

    function writeLocaleFile (path) {
      if (!exists(path)) {
        if (!writeFile(path, defaultLocaleMessages)) {
          api.exitLog(`cannot make ${path}`, 'error')
          return
        }
      } else {
        api.exitLog(`already exist ${path}`, 'info')
      }
    }

    const localesDirPath = api.resolve(`src/${localeDir}`)
    if (!exists(localesDirPath)) {
      if (!mkdir(localesDirPath)) {
        api.exitLog(`cannot make ${localesDirPath}`, 'error')
        return
      }
    }

    writeLocaleFile(api.resolve(`src/${localeDir}/${locale}.json`))
    if (locale !== fallbackLocale) {
      writeLocaleFile(api.resolve(`src/${localeDir}/${fallbackLocale}.json`))
    }

    const envPath = api.resolve('.env')
    const envVars = exists(envPath) ? readEnv(envPath) : {}

    if (envVars['VUE_APP_I18N_LOCALE']) {
      api.exitLog(`overwrite VUE_APP_I18N_LOCALE at ${envPath}`, 'info')
    }
    envVars['VUE_APP_I18N_LOCALE'] = locale

    if (envVars['VUE_APP_I18N_FALLBACK_LOCALE']) {
      api.exitLog(`overwrite VUE_APP_I18N_FALLBACK_LOCALE at ${envPath}`, 'info')
    }
    envVars['VUE_APP_I18N_FALLBACK_LOCALE'] = fallbackLocale

    if (!writeFile(envPath, buildEnvContent(envVars))) {
      api.exitLog(`cannot write to ${envPath}`, 'error')
      return
    }
  })

  api.postProcessFiles(files => {
    debug('postProcessFiles called')
    if (!api.hasPlugin('typescript')) { return }
    const tsConfigRaw = files['tsconfig.json']
    if (!tsConfigRaw) { return }
    const tsConfig = JSON.parse(tsConfigRaw)
    tsConfig.compilerOptions.types.push('webpack')
    tsConfig.compilerOptions.types.push('webpack-env')
    files['tsconfig.json'] = JSON.stringify(tsConfig, null, 2)
  })
}
