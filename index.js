const merge = require('deepmerge')
const debug = require('debug')('vue-cli-plugin-i18n:service')

module.exports = (api, options) => {
  debug('options', options)

  const { enableInSFC } = options.pluginOptions

  api.chainWebpack(webpackConfig => {
    if (enableInSFC) {
      const rule = webpackConfig.module
        .rule('vue')
        .use('vue-loader')
        .tap(options =>
          merge(options, {
            loaders: {
              i18n: '@kazupon/vue-i18n-loader'
            }
          })
        )
        .end()
    }
  })
}
