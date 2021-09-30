jest.setTimeout(10 * 60 * 1000)
jest.mock('inquirer')

const { create } = require('../helper/create')

afterEach(() => {
  jest.clearAllMocks()
})

test(`typescript project`, async () => {
  const { expectPrompts } = require('inquirer')

  const projectName = `vue-i18n-ts`
  const plugins = {
    '@vue/cli-plugin-babel': {},
    '@vue/cli-plugin-typescript': {
      classComponent: true
    }
  }
  expectPrompts([
    {
      input: 'ja'
    },
    {
      input: 'ja'
    },
    {
      input: 'loc'
    },
    {
      confirm: true
    },
    {
      useDefault: true
    }
  ])
  const project = await create(projectName, { plugins })
  const pkg = JSON.parse(await project.read('package.json'))

  expect(project.has('.env')).toBe(true)
  expect(project.has('src/i18n.ts')).toBe(true)
  expect(project.has('src/loc/ja.json')).toBe(true)
  expect(project.has('src/components/HelloI18n.vue')).toBe(true)
  expect(pkg.dependencies['vue-i18n']).not.toBeUndefined()
  expect(pkg.devDependencies['vue-cli-plugin-i18n']).not.toBeUndefined()
})
