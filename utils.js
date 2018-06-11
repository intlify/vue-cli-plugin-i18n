const fs = require('fs')
const path = require('path')

function checkInstalled (target) {
  let ret = true
  try {
    const resolveModule = require(path.resolve(target))
    if (!resolveModule) {
      ret = false
    }
  } catch (e) {
    ret = false
  }
  return ret
}

function exists (path) {
  let ret = true
  try {
    fs.accessSync(path, fs.constants.F_OK)
  } catch (e) {
    ret = false
  }
  return ret
}

function mkdir (path) {
  let ret = true
  try {
    fs.mkdirSync(path)
  } catch (e) {
    ret = false
  }
  return ret
}

function writeFile (path, content) {
  let ret = true
  try {
    fs.writeFileSync(path, content, { encoding: 'utf8' })
  } catch (e) {
    ret = false
  }
  return ret
}

function readFile (path) {
  let ret = ''
  try {
    ret = fs.readFileSync(path, { encoding: 'utf8' })
  } catch (e) {
    ret = ''
  }
  return ret
}

module.exports = {
  checkInstalled,
  exists,
  mkdir,
  writeFile,
  readFile
}
