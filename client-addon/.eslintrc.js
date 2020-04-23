module.exports = {
  root: true,
  env: {
    node: true
  },
  globals: {
    'ClientAddonApi': false,
    'mapSharedData': false,
    'Vue': false
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
