const { clientAddonConfig } = require('@vue/cli-ui')

module.exports = {
  ...clientAddonConfig({
    id: 'vue-i18n',
    port: 8043
  }),
  outputDir: '../client-addon-dist',
  pluginOptions: {
    enableInSFC: true
  }
}
