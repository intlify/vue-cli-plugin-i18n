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
  expect(output).toMatchSnapshot()
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
  expect(output).toMatchSnapshot()
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
  expect(output).toMatchSnapshot()
})
