const path = require('path')
const debug = require('debug')('vue-cli-plugin-i18n:service')

module.exports = (api, options) => {
  const { enableInSFC, localeDir } = options.pluginOptions.i18n
  debug('options', options)

  const { semver, loadModule } = require(require.resolve(
    '@vue/cli-shared-utils'
  ))
  const vue = loadModule('vue', api.service.context)
  debug('vue version', vue.version)
  const isVue3 = vue && semver.major(vue.version) === 3

  if (isVue3) {
    api.chainWebpack(webpackConfig => {
      debug('chainWebpack called')

      webpackConfig.module
        .rule('i18n-resource')
        .test(/\.(json5?|ya?ml)$/)
        .include.add(path.resolve(__dirname, '../../', `./src/${localeDir}`))
        .end()
        .type('javascript/auto')
        .use('i18n-resource')
        .loader('@intlify/vue-i18n-loader')
      webpackConfig.module
        .rule('i18n')
        .resourceQuery(/blockType=i18n/)
        .type('javascript/auto')
        .use('i18n')
        .loader('@intlify/vue-i18n-loader')
    })
  } else {
    api.chainWebpack(webpackConfig => {
      debug('chainWebpack called')

      if (enableInSFC) {
        webpackConfig.module
          .rule('i18n')
          .resourceQuery(/blockType=i18n/)
          .type('javascript/auto')
          .use('i18n')
          .loader('@intlify/vue-i18n-loader')
          .end()
          .end()
      }
    })
  }

  const report = require('./report')
  api.registerCommand('i18n:report', report.options, args =>
    report.service(args, api)
  )
}

module.exports.defaultModes = {
  build: 'production'
}
