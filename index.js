const debug = require('debug')('vue-cli-plugin-i18n:service')

module.exports = (api, options) => {
  const { enableInSFC } = options.pluginOptions.i18n
  debug('options', options)

  api.chainWebpack(webpackConfig => {
    debug('chainWebpack called')

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
