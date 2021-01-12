jest.setTimeout(10 * 60 * 1000)
jest.mock('inquirer')

const { create } = require('../helper/create')

afterEach(() => {
  jest.clearAllMocks()
})

test(`javascript project`, async () => {
  const { expectPrompts } = require('inquirer')

  const projectName = `vue-i18n-js`
  const plugins = {
    '@vue/cli-plugin-babel': {}
  }
  expectPrompts([
    {
      useDefault: true
    },
    {
      useDefault: true
    },
    {
      useDefault: true
    },
    {
      useDefault: true
    }
  ])
  const project = await create(projectName, { plugins })
  const pkg = JSON.parse(await project.read('package.json'))

  expect(project.has('.env')).toBe(true)
  expect(project.has('src/i18n.js')).toBe(true)
  expect(project.has('src/locales/en.json')).toBe(true)
  expect(project.has('src/components/HelloI18n.vue')).toBe(false)
  expect(pkg.dependencies['vue-i18n']).not.toBeUndefined()
  expect(pkg.devDependencies['vue-cli-plugin-i18n']).not.toBeUndefined()
})
