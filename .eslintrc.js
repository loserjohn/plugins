/*
 * @Author       : xh
 * @Date         : 2022-06-22 17:05:13
 * @LastEditors  : xh
 * @FileName     :
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
    amd: true
  },
  extends: ['eslint:recommended', 'plugin:vue/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    parser: 'babel-eslint',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    }
  },
  plugins: ['vue'],
  rules: {
    'no-debugger': 0,
    'vue/no-mutating-props': 0
  }
}
