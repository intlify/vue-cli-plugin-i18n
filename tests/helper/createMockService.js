const Service = require('@vue/cli-service')

module.exports = (plugins = [], context = '/', init = true, mode) => {
  const service = new Service(context, {
    plugins,
    useBuiltIn: false
  })
  if (init) {
    service.init(mode)
  }
  return service
}
