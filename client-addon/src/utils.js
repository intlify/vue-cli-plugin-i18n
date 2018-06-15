import { unflatten } from 'flat'

export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

export function hasChildPaths (path, paths) {
  if (!path) { return false }

  const localeMessages = unflatten(paths.reduce((val, path) => {
    val[path] = ''
    return val
  }, {}))
  const splits = path.split('.')

  // TODO: should be more strogly checking ...
  let p = null
  let data = localeMessages
  while ((p = splits.shift())) {
    data = data[p]
  }
  return data !== undefined
}
