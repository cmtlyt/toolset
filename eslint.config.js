import antfu from '@antfu/eslint-config';

export default antfu({
  formatters: true,
  type: 'lib',
  ignores: [
    'patches',
    'playgrounds',
    '**/types',
    '**/cache',
    '**/dist',
    '**/.temp',
    '**/*.svg',
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
