const fs = require('fs')
const path = require('path')

function checkInstalled (target) {
  let ret = true
  try {
    const resolveModule = require(path.resolve(target))
    if (!resolveModule) {
      ret = false
    }
  } catch (e) {
    ret = false
  }
  return ret
}

function exists (path) {
  let ret = true
  try {
    fs.accessSync(path, fs.constants.F_OK)
  } catch (e) {
    ret = false
  }
  return ret
}

function mkdir (path) {
  let ret = true
  try {
    fs.mkdirSync(path)
  } catch (e) {
    ret = false
  }
  return ret
}

function writeFile (path, content) {
  let ret = true
  try {
    fs.writeFileSync(path, content, { encoding: 'utf8' })
  } catch (e) {
    ret = false
  }
  return ret
}

function readFile (path) {
  let ret = ''
  try {
    ret = fs.readFileSync(path, { encoding: 'utf8' })
  } catch (e) {
    ret = ''
  }
  return ret
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
  }

  api.onCreateComplete(() => {
    const defaultLocaleMessages = JSON.stringify({
      message: 'hello i18n !!'
    }, null, 2)

    function writeLocaleFile (path) {
      if (!exists(path)) {
        if (!writeFile(path, defaultLocaleMessages)) {
          api.exitLog(`cannot make ${path}`, 'error')
        }
      } else {
        console.warn(`already exist ${path}`)
      }
    }

    const localesDirPath = api.resolve('./src/locales')
    if (!exists(localesDirPath)) {
      if (!mkdir(localesDirPath)) {
        api.exitLog(`cannot make ${localesDirPath}`, 'error')
      }
    }

    writeLocaleFile(api.resolve(`./src/locales/${locale}.json`))
    if (locale !== fallbackLocale) {
      writeLocaleFile(api.resolve(`./src/locales/${fallbackLocale}.json`))
    }

    const envPath = api.resolve('.env')
    let content = exists(envPath) ? readFile(envPath) : ''

    if (content.indexOf('VUE_APP_I18N_LOCALE=') === -1) {
      content += `VUE_APP_I18N_LOCALE=${locale}\n`
    } else {
      content = content.replace(
        /VUE_APP_I18N_LOCALE=(.*)\n/,
        `VUE_APP_I18N_LOCALE=${locale}`
      )
    }

    if (content.indexOf('VUE_APP_I18N_FALLBACK_LOCALE=') === -1) {
      content += `VUE_APP_I18N_FALLBACK_LOCALE=${fallbackLocale}\n`
    } else {
      content = content.replace(
        /VUE_APP_I18N_FALLBACK_LOCALE=(.*)\n/,
        `VUE_APP_I18N_FALLBACK_LOCALE=${fallbackLocale}`
      )
    }

    if (!writeFile(envPath, content)) {
      api.exitLog(`cannot write ${envPath}`, 'error')
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
