module.exports = {
  extends: ['plugin:vue-libs/recommended'],
  env: {
  },
  rules: {
    indent: ['error', 2, { 'MemberExpression': 'off' }],
    'vue-libs/no-async-functions': 2
  }
}
