const { chalk } = require(require.resolve('@vue/cli-shared-utils'))
const { resolve } = require('path')
const i18nExtract = require('vue-i18n-extract').default

const EXTRACT_MISSING = 1
const EXTRACT_UNUSED = 2
const EXTRACT_ALL = 3

const options = {
  description: 'vue-i18n report',
  usage: 'vue-cli-service i18n:report [options]',
  options: {
    locales: 'target locale files path, required',
    src: 'target source codes path, required',
    type: 'reporting type, default `missing` and `unused` all, optional',
    output: 'create a json file out of report, optional'
  }
}

function resolveReportType (args) {
  let type = EXTRACT_ALL
  if (args.type === 'missing') {
    type = EXTRACT_MISSING
  } else if (args.type === 'unused') {
    type = EXTRACT_UNUSED
  }
  return type
}

async function service (args = {}, api) {
  if (!args.src) {
    console.log(chalk.red(`not specified 'src' argument.`))
    return
  }

  if (!args.locales) {
    console.log(chalk.red(`not specified 'locales' argument.`))
    return
  }

  const currentDir = process.cwd()
  const srcFiles = resolve(currentDir, args.src)
  const localeFiles = resolve(currentDir, args.locales)
  const extractType = resolveReportType(args)

  const i18nReport = i18nExtract.createI18NReport(srcFiles, localeFiles, extractType)
  i18nExtract.logI18NReport(i18nReport)

  if (args.output) {
    await i18nExtract.writeReportToFile(i18nReport, args.output)
  }

  return i18nReport
}

module.exports = {
  service,
  options
}
