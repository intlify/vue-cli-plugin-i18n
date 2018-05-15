const debug = require('debug')('vue-cli-plugin-i18n:service')

module.exports = (api, options) => {
  debug('options', options)

  const { enableInSFC } = options.pluginOptions

  api.chainWebpack(webpackConfig => {
    if (enableInSFC) {
      webpackConfig.module
        .rule('i18n')
          .resourceQuery(/blockType=i18n/)
          .use('i18n')
            .loader('@kazupon/vue-i18n-loader')
            .end()
          .end()
    }
  })
}
