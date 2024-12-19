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
    '**/__test__',
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
});
