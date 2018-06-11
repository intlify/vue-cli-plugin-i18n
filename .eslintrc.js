module.exports = {
  extends: ['plugin:vue-libs/recommended'],
  env: {
  },
  rules: {
    indent: ['error', 2, { 'MemberExpression': 'off' }],
    'object-curly-spacing': ['error', 'always']
  }
}
