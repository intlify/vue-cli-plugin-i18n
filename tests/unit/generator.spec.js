const generateWithPlugin = require('@vue/cli-test-utils/generateWithPlugin')

test('javascript', async () => {
  const projectName = 'vue-i18n-gen-js'
  const { pkg, files } = await generateWithPlugin([{
    id: '@vue/cli-service',
    apply: () => {},
    options: { projectName }
  }, {
    id: 'i18n',
    apply: require('../../generator'),
    options: { localeDir: 'locales' }
  }])

  // check files
  const i18n = files['src/i18n.js']
  expect(i18n).toMatch(`const locales = require.context('./locales', true, /[A-Za-z0-9-_,\\s]+\\.json$/i)`)
  const pack = files['package.json']
  expect(pack).toMatch(`"vue-i18n": "^8.0.0"`)
})

test('typescript', async () => {
  const projectName = 'vue-i18n-gen-ts'
  const { pkg, files } = await generateWithPlugin([{
    id: '@vue/cli-service',
    apply: () => {},
    options: { projectName }
  }, {
    id: '@vue/cli-plugin-typescript',
    apply: () => {},
    options: { projectName }
  }, {
    id: 'i18n',
    apply: require('../../generator'),
    options: { locale: 'ja', localeDir: 'loc', enableInSFC: true }
  }])

  // check files
  const i18n = files['src/i18n.ts']
  expect(i18n).toMatch(`const locales = require.context('./loc', true, /[A-Za-z0-9-_,\\s]+\\.json$/i)`)
  const sfc = files['src/components/HelloI18n.vue']
  expect(sfc).toMatch(`export default Vue.extend({`)
  const pack = files['package.json']
  expect(pack).toMatch(`"vue-i18n": "^8.0.0"`)
  expect(pack).toMatch(`"@kazupon/vue-i18n-loader": "^0.3.0"`)
  expect(pack).toMatch(`"@types/webpack": "^4.4.0"`)
})