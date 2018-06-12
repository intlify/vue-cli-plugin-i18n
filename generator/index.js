const {
  checkInstalled,
  exists,
  mkdir,
  writeFile,
  readFile
} = require('../utils')
const dotenv = require('dotenv')

function readEnv (path) {
  let ret = {}
  try {
    ret = dotenv.parse(Buffer.from(readFile(path)))
  } catch (e) {
    console.warn('readEnv error:', e.message)
    ret = {}
  }
  return ret
}

function buildEnvContent (values) {
  let content = ''
  Object.keys(values).forEach(key => {
    content += `${key}=${values[key]}\n`
  })
  return content
}

module.exports = (api, options, rootOptions) => {
  const { locale, fallbackLocale, enableInSFC } = options

  try {
    const tsPath = api.resolve('src/main.ts')
    const jsPath = api.resolve('src/main.js')
    const tsExists = exists(tsPath)
    const jsExists = exists(jsPath)

    if (!tsExists && !jsExists) {
      api.exitLog('No entry found', 'error')
      return
    }

    const lang = tsExists && api.hasPlugin('typescript') ? 'ts' : 'js'
    const classComponent = tsExists &&
      checkInstalled('./node_modules/vue-class-component/package.json') &&
      checkInstalled('./node_modules/vue-property-decorator/package.json')
    const additionalOptions = { ...options, ...{ lang, classComponent } }

    /*
     * extend packages
     */

    const pkg = {
      dependencies: {
        'vue-i18n': '^7.8.0'
      },
      vue: {
        pluginOptions: { enableInSFC }
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
      if (!checkInstalled('./node_modules/@types/webpack-env/package.json')) {
        devTsDependencies['@types/webpack-env'] = '^1.13.6'
      }
      pkg.devDependencies = { ...pkg.devDependencies, ...devTsDependencies }
    }

    api.extendPackage(pkg)

    /*
     * render templates
     */

    // i18n templates for program language
    api.render(`./templates/${lang}`, { ...additionalOptions })

    // locale messages in SFC examples
    if (enableInSFC) {
      api.render('./templates/sfc', { ...additionalOptions })
    }

    /*
     * Modify main.(js|ts)
     */
    const file = lang === 'ts' ? 'src/main.ts' : 'src/main.js'
    api.injectImports(file, `import i18n from './i18n'`)
    api.injectRootOptions(file, `i18n,`)
  } catch (e) {
    api.exitLog(`unexpected error in vue-cli-plugin-i18n: ${e.message}`, 'error')
    return
  }

  api.onCreateComplete(() => {
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

    const localesDirPath = api.resolve('./src/locales')
    if (!exists(localesDirPath)) {
      if (!mkdir(localesDirPath)) {
        api.exitLog(`cannot make ${localesDirPath}`, 'error')
        return
      }
    }

    writeLocaleFile(api.resolve(`./src/locales/${locale}.json`))
    if (locale !== fallbackLocale) {
      writeLocaleFile(api.resolve(`./src/locales/${fallbackLocale}.json`))
    }

    const envPath = api.resolve('.env')
    let envVars = exists(envPath) ? readEnv(envPath) : {}

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
    if (!api.hasPlugin('typescript')) { return }
    const tsConfigRaw = files['tsconfig.json']
    const tsConfig = JSON.parse(tsConfigRaw)
    tsConfig.compilerOptions.types.push('webpack')
    tsConfig.compilerOptions.types.push('webpack-env')
    files['tsconfig.json'] = JSON.stringify(tsConfig, null, 2)
  })
}
