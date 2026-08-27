// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'vue/multi-word-component-names': 'off',
    // Arrow functions only — no `function` declarations or expressions.
    'func-style': ['error', 'expression'],
    'prefer-arrow-callback': 'error',
  },
})
