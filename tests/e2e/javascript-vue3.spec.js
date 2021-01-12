jest.setTimeout(10 * 60 * 1000)
jest.mock('inquirer')

const { createUpgradable } = require('../helper/create')

afterEach(() => {
  jest.clearAllMocks()
})

test(`javascript project: compostion`, async () => {
  const { expectPrompts } = require('inquirer')

  const projectName = `vue-i18n-composition-js`
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
  const project = await createUpgradable(projectName, {
    vueVersion: '3',
    plugins
  })
  const pkg = JSON.parse(await project.read('package.json'))

  expect(project.has('.env')).toBe(true)
  expect(project.has('src/i18n.js')).toBe(true)
  expect(project.has('src/locales/en.json')).toBe(true)
  expect(project.has('src/components/HelloI18n.vue')).toBe(true)
  expect(pkg.dependencies['vue-i18n']).not.toBeUndefined()
  expect(pkg.devDependencies['vue-cli-plugin-i18n']).not.toBeUndefined()
})

test(`javascript project: legacy`, async () => {
  const { expectPrompts } = require('inquirer')

  const projectName = `vue-i18n-legacy-js`
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
      confirm: true
    }
  ])
  const project = await createUpgradable(projectName, {
    vueVersion: '3',
    plugins
  })
  const pkg = JSON.parse(await project.read('package.json'))

  expect(project.has('.env')).toBe(true)
  expect(project.has('src/i18n.js')).toBe(true)
  expect(project.has('src/locales/en.json')).toBe(true)
  expect(project.has('src/components/HelloI18n.vue')).toBe(true)
  expect(pkg.dependencies['vue-i18n']).not.toBeUndefined()
  expect(pkg.devDependencies['vue-cli-plugin-i18n']).not.toBeUndefined()
})
