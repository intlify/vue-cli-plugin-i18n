const createMockService = require('../helper/createMockService')

test('report command: basic', async () => {
  const report = require('../../report')

  const service = createMockService([{
    id: 'vue-cli-plugin-i18n',
    apply: api => {
      api.registerCommand('i18n:report', report.options, report.service)
    }
  }], process.cwd())

  const output = await service.run('i18n:report', {
    src: './tests/fixture/**/*.?(js|vue)',
    locales: './tests/fixture/locales/*.json'
  })
  const missingKeys = [
    { path: 'messages.fuga.foo', language: 'en' },
    { path: 'messages.buz', language: 'ja' },
    { path: 'messages.bar', language: 'ja' },
    { path: 'messages.hoge', language: 'ja' },
    { path: 'messages.fuga.foo', language: 'ja' }
  ]
  const unusedKeys = [
    { path: 'messages.piyo', language: 'en' },
    { path: 'messages.piyo', language: 'ja' }
  ]
  const predicate = item => {
    return {
      path: item.path,
      language: item.language
    }
  }
  expect(output.missingKeys.map(predicate)).toEqual(missingKeys)
  expect(output.unusedKeys.map(predicate)).toEqual(unusedKeys)
})

test('report command: required arguments', async () => {
  const report = require('../../report')

  const service = createMockService([{
    id: 'vue-cli-plugin-i18n',
    apply: api => {
      api.registerCommand('i18n:report', report.options, report.service)
    }
  }], process.cwd())

  const output = await service.run('i18n:report', {})
  expect(output).toBeUndefined()
})
 
test('report command: optional arguments', async () => {
  const report = require('../../report')

  const service = createMockService([{
    id: 'vue-cli-plugin-i18n',
    apply: api => {
      api.registerCommand('i18n:report', report.options, report.service)
    }
  }], process.cwd())

  const output = await service.run('i18n:report', {
    src: './tests/fixture/**/*.?(js|vue)',
    locales: './tests/fixture/locales/*.json',
    type: 'missing',
    output: './tests/output.json'
  })
  const missingKeys = [
    { path: 'messages.fuga.foo', language: 'en' },
    { path: 'messages.buz', language: 'ja' },
    { path: 'messages.bar', language: 'ja' },
    { path: 'messages.hoge', language: 'ja' },
    { path: 'messages.fuga.foo', language: 'ja' }
  ]
  const predicate = item => {
    return {
      path: item.path,
      language: item.language
    }
  }
  expect(output.missingKeys.map(predicate)).toEqual(missingKeys)
})
