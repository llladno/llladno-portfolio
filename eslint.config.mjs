// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

/**
 * FSD layers, outer → inner. A slice may import from layers strictly below it
 * and from its own slice — never sideways or upward. Enforced per-layer with
 * `no-restricted-imports` blocks below.
 */
const upwardImportsFor = (forbidden) => ({
  'no-restricted-imports': [
    'error',
    {
      patterns: forbidden.map((layer) => ({
        group: [`~/${layer}`, `~/${layer}/**`],
        message: `FSD: this layer must not import from ~/${layer} (imports only go downward).`,
      })),
    },
  ],
})

export default withNuxt(
  {
    rules: {
      'vue/multi-word-component-names': 'off',

      // Self-closing style is Prettier's call (it self-closes void elements
      // like <source>); keep the lint rule out of that overlap.
      'vue/html-self-closing': 'off',

      // Arrow functions only — no `function` declarations or expressions.
      'func-style': ['error', 'expression'],
      'prefer-arrow-callback': 'error',

      // Readable identifiers — catches `p`, `e`, `el`, `ctx`, `fn`.
      'id-length': [
        'error',
        { min: 3, exceptions: ['t', '_', 'ru', 'en', 'as', 'x', 'y', 'id'] },
      ],

      // Magic numbers belong in named constants.
      'no-magic-numbers': [
        'warn',
        {
          ignore: [-1, 0, 1, 2],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          enforceConst: true,
        },
      ],
    },
  },
  {
    files: ['app/widgets/**'],
    rules: upwardImportsFor(['app']),
  },
  {
    files: ['app/features/**'],
    rules: upwardImportsFor(['app', 'widgets']),
  },
  {
    files: ['app/entities/**'],
    rules: upwardImportsFor(['app', 'widgets', 'features']),
  },
  {
    files: ['app/shared/**'],
    rules: upwardImportsFor(['app', 'widgets', 'features', 'entities']),
  },
  {
    files: ['tests/**', 'scripts/**', '*.config.*'],
    rules: { 'no-magic-numbers': 'off', 'id-length': 'off' },
  },
)
