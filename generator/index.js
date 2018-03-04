const debug = require('debug')('vue-cli-plugin-i18n:generator')

module.exports = (api, options, rootOptions) => {
  debug('options', options)
  debug('rootOptions', rootOptions)

  api.extendPackage({
    dependencies: {
      'vue-i18n': '^7.4.2'
    }
  })

  api.render('./templates', { ...options })

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
