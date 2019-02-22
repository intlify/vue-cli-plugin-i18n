const path = require('path')
const createTestProject = require('@vue/cli-test-utils/createTestProject')

async function create (name, presets) {
  const project = await createTestProject(
    name, presets, path.join(process.cwd(), './tests/e2e/projects')
  )

  // mocking...
  const pkg = JSON.parse(await project.read('package.json'))
  pkg.devDependencies['vue-cli-plugin-i18n'] = '../../../..'
  await project.write('package.json', JSON.stringify(pkg, null, 2))

  const invoke = require('@vue/cli/lib/invoke')
  await invoke('i18n', {}, project.dir)
  return Promise.resolve(project)
}

module.exports = create