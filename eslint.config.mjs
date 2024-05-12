// @ts-check
// .eslintrc.js

import withNuxt from './.nuxt/eslint.config.mjs'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  ...withNuxt(),
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:nuxt/recommended',
    'prettier',
    'prettier/vue',
    'prettier/@typescript-eslint',
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'warn',
    'no-debugger': 'warn',
    'vue/multi-word-component-names': 'off',
  },
  overrides: [
    {
      files: ['components/**/*.vue'],
      rules: {
        'vue/component-definition-name-casing': ['error', 'PascalCase'],
      },
    },
  ],
  settings: {
    'vue/component-prefer-generic-property-access': true,
  },
}
