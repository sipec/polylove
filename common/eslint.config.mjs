import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // disable this particular rule for now, since the `any` annotations are very tricky to get rid of
      '@typescript-eslint/no-unused-expressions': 'off', // turn this off too for now, otherwise ESLint says "Cannot read properties of undefined"
    },
  },
]
