import antfu from '@antfu/eslint-config';

export default antfu({
  formatters: true,
  type: 'lib',
  ignores: [
    'patches',
    'playgrounds',
    '**/cache',
    '**/dist',
    '**/.temp',
    '**/*.svg',
    'packages/create-origin/template',
  ],
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: true,
  },
}, {
  rules: {
    'ts/explicit-function-return-type': 'off',
  },
}, {
  files: ['**/__test__/*'],
  rules: {
    'eslint-comments/no-unlimited-disable': 'off',
  },
});
