const generateWithPlugin = require('@vue/cli-test-utils/generateWithPlugin')

test('javascript: legacy', async () => {
  const { files } = await generateWithPlugin([
    {
      id: '@vue/cli-service',
      apply: require('@vue/cli-service/generator'),
      options: { vueVersion: '3' }
    },
    {
      id: 'vue-cli-plugin-i18n',
      apply: require('../../generator'),
      options: { localeDir: 'locales', locale: 'en', enableLegacy: true }
    }
  ])

  // check files
  const i18n = files['src/i18n.js']
  expect(i18n).toMatch(`import { createI18n } from 'vue-i18n'`)
  expect(i18n).toMatch(
    `const locales = require.context('./locales', true, /[A-Za-z0-9-_,\\s]+\\.json$/i)`
  )
  expect(i18n).not.toMatch(`legacy: false`)
  const locale = files['src/locales/en.json']
  expect(locale).toMatch(`{\n  "message": "hello i18n !!"\n}`)
  const sfc = files['src/components/HelloI18n.vue']
  expect(sfc).toMatch(`<p>{{ $t('hello') }}</p>`)
  expect(sfc).toMatch(`import { defineComponent } from 'vue'`)
  expect(sfc).toMatch(`export default defineComponent({`)
  const pack = files['package.json']
  expect(pack).toMatch(`"vue-i18n": "^9.1.0"`)
  expect(pack).toMatch(`"@intlify/vue-i18n-loader": "^3.0.0"`)
})

test('javascript: composition', async () => {
  const { files } = await generateWithPlugin([
    {
      id: '@vue/cli-service',
      apply: require('@vue/cli-service/generator'),
      options: { vueVersion: '3' }
    },
    {
      id: 'vue-cli-plugin-i18n',
      apply: require('../../generator'),
      options: { localeDir: 'locales', locale: 'en', enableLegacy: false }
    }
  ])

  // check files
  const i18n = files['src/i18n.js']
  expect(i18n).toMatch(`import { createI18n } from 'vue-i18n'`)
  expect(i18n).toMatch(
    `const locales = require.context('./locales', true, /[A-Za-z0-9-_,\\s]+\\.json$/i)`
  )
  expect(i18n).toMatch(`legacy: false`)
  const locale = files['src/locales/en.json']
  expect(locale).toMatch(`{\n  "message": "hello i18n !!"\n}`)
  const sfc = files['src/components/HelloI18n.vue']
  expect(sfc).toMatch(`<p>{{ t('hello') }}</p>`)
  expect(sfc).toMatch(`import { defineComponent } from 'vue'`)
  expect(sfc).toMatch(`import { useI18n } from 'vue-i18n'`)
  expect(sfc).toMatch(`export default defineComponent({`)
  expect(sfc).toMatch(`const { t } = useI18n({`)
  const pack = files['package.json']
  expect(pack).toMatch(`"vue-i18n": "^9.1.0"`)
  expect(pack).toMatch(`"@intlify/vue-i18n-loader": "^3.0.0"`)
})

test('typescript: composition', async () => {
  const { files } = await generateWithPlugin([
    {
      id: '@vue/cli-service',
      apply: require('@vue/cli-service/generator'),
      options: { vueVersion: '3' }
    },
    {
      id: '@vue/cli-plugin-typescript',
      apply: () => {},
      options: {}
    },
    {
      id: 'vue-cli-plugin-i18n',
      apply: require('../../generator'),
      options: { localeDir: 'loc', locale: 'ja', enableLegacy: false }
    }
  ])

  // check files
  const i18n = files['src/i18n.ts']
  expect(i18n).toMatch(
    `import { createI18n, LocaleMessages, VueMessageType } from 'vue-i18n'`
  )
  expect(i18n).toMatch(
    `function loadLocaleMessages(): LocaleMessages<VueMessageType> {`
  )
  expect(i18n).toMatch(
    `const locales = require.context('./loc', true, /[A-Za-z0-9-_,\\s]+\\.json$/i)`
  )
  expect(i18n).toMatch(`const messages: LocaleMessages<VueMessageType> = {}`)
  const locale = files['src/loc/ja.json']
  expect(locale).toMatch(`{\n  "message": "hello i18n !!"\n}`)
  const sfc = files['src/components/HelloI18n.vue']
  expect(sfc).toMatch(`<p>{{ t('hello') }}</p>`)
  expect(sfc).toMatch(`<script lang="ts">`)
  expect(sfc).toMatch(`import { defineComponent } from 'vue'`)
  expect(sfc).toMatch(`import { useI18n } from 'vue-i18n'`)
  expect(sfc).toMatch(`export default defineComponent({`)
  expect(sfc).toMatch(`const { t } = useI18n({`)
  const pack = files['package.json']
  expect(pack).toMatch(`"vue-i18n": "^9.1.0"`)
  expect(pack).toMatch(`"@intlify/vue-i18n-loader": "^3.0.0"`)
})
