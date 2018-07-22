const { clientAddonConfig } = require('@vue/cli-ui')

module.exports = {
  ...clientAddonConfig({
    id: 'org.kazupon.vue-i18n.client-addon',
    port: 8043
  }),
  outputDir: '../client-addon-dist',
  pluginOptions: {
    enableInSFC: true
  }
}
