const fs = require('fs')
const path = require('path')

function checkInstalled (target) {
  let ret = true
  try {
    const resolveModule = require(path.resolve(target))
    if (!resolveModule) { ret = false }
  } catch (e) {
    ret = false
  }
  return ret
}

module.exports = (api, options, rootOptions) => {
  const { enableInSFC } = options

  try {
    const tsPath = api.resolve('src/main.ts')
    const jsPath = api.resolve('src/main.js')
    const tsExists = fs.existsSync(tsPath)
    const jsExists = fs.existsSync(jsPath)

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

    // common i18n templates
    api.render('./templates/common', { ...additionalOptions })

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

  api.postProcessFiles(files => {
    if (!api.hasPlugin('typescript')) { return }
    const tsConfigRaw = files['tsconfig.json']
    const tsConfig = JSON.parse(tsConfigRaw)
    tsConfig.compilerOptions.types.push('webpack')
    tsConfig.compilerOptions.types.push('webpack-env')
    files['tsconfig.json'] = JSON.stringify(tsConfig, null, 2)
  })
}
