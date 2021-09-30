const generateWithPlugin = require('@vue/cli-test-utils/generateWithPlugin')

test('javascript', async () => {
  const projectName = 'vue-i18n-gen-js'
  const { files } = await generateWithPlugin([
    {
      id: '@vue/cli-service',
      apply: () => {},
      options: { projectName }
    },
    {
      id: 'i18n',
      apply: require('../../generator'),
      options: { localeDir: 'locales', locale: 'en' }
    }
  ])

  // check files
  const i18n = files['src/i18n.js']
  expect(i18n).toMatch(
    `const locales = require.context('./locales', true, /[A-Za-z0-9-_,\\s]+\\.json$/i)`
  )
  const locale = files['src/locales/en.json']
  expect(locale).toMatch(`{\n  "message": "hello i18n !!"\n}`)
  const pack = files['package.json']
  expect(pack).toMatch(`"vue-i18n": "^8.26.3"`)
  expect(pack).not.toMatch(`"@intlify/vue-i18n-loader": "^1.1.0"`)
})

test('typescript', async () => {
  const projectName = 'vue-i18n-gen-ts'
  const { files } = await generateWithPlugin([
    {
      id: '@vue/cli-service',
      apply: () => {},
      options: { projectName }
    },
    {
      id: '@vue/cli-plugin-typescript',
      apply: () => {},
      options: { projectName }
    },
    {
      id: 'i18n',
      apply: require('../../generator'),
      options: { locale: 'ja', localeDir: 'loc', enableInSFC: true }
    }
  ])

  // check files
  const i18n = files['src/i18n.ts']
  expect(i18n).toMatch(
    `const locales = require.context('./loc', true, /[A-Za-z0-9-_,\\s]+\\.json$/i)`
  )
  const locale = files['src/loc/ja.json']
  expect(locale).toMatch(`{\n  "message": "hello i18n !!"\n}`)
  const sfc = files['src/components/HelloI18n.vue']
  expect(sfc).toMatch(`export default Vue.extend({`)
  const pack = files['package.json']
  expect(pack).toMatch(`"vue-i18n": "^8.26.3"`)
  expect(pack).toMatch(`"@intlify/vue-i18n-loader": "^1.1.0"`)
})

test('bridge', async () => {
  const projectName = 'vue-i18n-gen-ts-bridge'
  const { files } = await generateWithPlugin([
    {
      id: '@vue/cli-service',
      apply: () => {},
      options: { projectName }
    },
    {
      id: '@vue/cli-plugin-typescript',
      apply: () => {},
      options: { projectName }
    },
    {
      id: 'i18n',
      apply: require('../../generator'),
      options: {
        locale: 'ja',
        localeDir: 'loc',
        enableInSFC: true,
        enableBridge: true
      }
    }
  ])

  // check files
  const i18n = files['src/i18n.ts']
  expect(i18n).toMatch(
    `const locales = require.context('./loc', true, /[A-Za-z0-9-_,\\s]+\\.json$/i)`
  )
  const locale = files['src/loc/ja.json']
  expect(locale).toMatch(`{\n  "message": "hello i18n !!"\n}`)
  const sfc = files['src/components/HelloI18n.vue']
  expect(sfc).toMatch(`export default Vue.extend({`)
  const pack = files['package.json']
  expect(pack).toMatch(`"vue-i18n": "^8.26.3"`)
  expect(pack).toMatch(`"vue-i18n-bridge": "^9.2.0-beta.10"`)
  expect(pack).toMatch(`"@intlify/vue-i18n-loader": "^3.2.0"`)
})
