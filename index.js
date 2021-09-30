const webpack = require('webpack')
const path = require('path')
const debug = require('debug')('vue-cli-plugin-i18n:service')

module.exports = (api, options) => {
  const {
    enableInSFC,
    localeDir,
    runtimeOnly,
    enableLegacy,
    enableBridge,
    includeLocales,
    compositionOnly,
    fullInstall
  } = options.pluginOptions.i18n
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

      // prettier-ignore
      webpackConfig.module
        .rule('i18n-resource')
        .test(/\.(json5?|ya?ml)$/)
          .include.add(path.resolve(__dirname, '../../', `./src/${localeDir}`))
          .end()
        .type('javascript/auto')
        .use('i18n-resource')
          .loader('@intlify/vue-i18n-loader')
      // prettier-ignore
      webpackConfig.module
        .rule('i18n')
        .resourceQuery(/blockType=i18n/)
        .type('javascript/auto')
        .use('i18n')
          .loader('@intlify/vue-i18n-loader')

      if (runtimeOnly) {
        webpackConfig.resolve.alias.set(
          'vue-i18n',
          'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js'
        )
        debug('set vue-i18n runtime only')
      }

      // prettier-ignore
      const legacyApiFlag = enableLegacy
        ? 'true'
        : compositionOnly
          ? 'false' : 'true'
      const installFlag = fullInstall ? 'true' : 'false'
      webpackConfig.plugin('vue-i18n-feature-flags').use(webpack.DefinePlugin, [
        {
          __VUE_I18N_LEGACY_API__: legacyApiFlag,
          __VUE_I18N_FULL_INSTALL__: installFlag,
          __VUE_I18N_PROD_DEVTOOLS__: 'false'
        }
      ])
      debug(
        'set __VUE_I18N_LEGACY_API__ and __VUE_I18N_FULL_INSTALL',
        legacyApiFlag,
        installFlag
      )
    })
  } else {
    api.chainWebpack(webpackConfig => {
      debug('chainWebpack called')

      if (enableInSFC) {
        if (!enableBridge) {
          // prettier-ignore
          webpackConfig.module
            .rule('i18n')
            .resourceQuery(/blockType=i18n/)
            .type('javascript/auto')
            .use('i18n')
              .loader('@intlify/vue-i18n-loader')
              .end()
            .end()
        } else {
          // prettier-ignore
          if (includeLocales) {
            webpackConfig.module
              .rule('i18n-resource')
              .test(/\.(json5?|ya?ml)$/)
                .include.add(path.resolve(__dirname, '../../', `./src/${localeDir}`))
                .end()
              .type('javascript/auto')
              .use('i18n-resource')
                .loader('@intlify/vue-i18n-loader')
                .options({ bridge: true })
          }
          // prettier-ignore
          webpackConfig.module
            .rule('i18n')
            .resourceQuery(/blockType=i18n/)
            .type('javascript/auto')
            .use('i18n')
              .loader('@intlify/vue-i18n-loader')
              .options({ bridge: true })

          if (runtimeOnly) {
            webpackConfig.resolve.alias.set(
              'vue-i18n-bridge',
              'vue-i18n-bridge/dist/vue-i18n-bridge.runtime.esm-bundler.js'
            )
            debug('set vue-i18n-bridge runtime only')
          }
        }
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
