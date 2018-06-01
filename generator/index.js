module.exports = (api, options, rootOptions) => {
  const { enableInSFC } = options

  /*
   * extend packages
   */

  const pkg = {
    dependencies: {
      'vue-i18n': '^7.4.2'
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

  api.extendPackage(pkg)

  /*
   * render templates
   */

  // basic templates
  api.render('./templates/basic', { ...options })

  // locale messages in SFC examples
  if (enableInSFC) {
    api.render('./templates/sfc', { ...options })
  }

  /*
   * other processes
   */

  api.onCreateComplete(() => {
    // Inejct to main.js
    // NOTE: bollow vue-cli-plugin-apollo

    const fs = require('fs')

    const mainPath = api.resolve('./src/main.js')
    let content = fs.readFileSync(mainPath, { encoding: 'utf8' })

    const lines = content.split(/\r?\n/g).reverse()

    // Inject import
    const lastImportIndex = lines.findIndex(line => line.match(/^import/))
    lines[lastImportIndex] += `\nimport i18n from './i18n'`

    // Modify app
    const appIndex = lines.findIndex(line => line.match(/new Vue/))
    lines[appIndex] += `\n  i18n,`

    content = lines.reverse().join('\n')
    fs.writeFileSync(mainPath, content, { encoding: 'utf8' })
  })
}
