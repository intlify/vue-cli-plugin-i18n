import App from './App.vue'

ClientAddonApi.addRoutes('vue-i18n', [
  { path: '', name: 'vue-i18n-entry', component: App }
])

const locales = require.context('./locales', true, /[a-z0-9]+\.json$/i)
locales.keys().forEach(key => {
  const locale = key.match(/([a-z0-9]+)\./i)[1]
  ClientAddonApi.addLocalization(locale, locales(key))
})
