const _default = `
import antfu from '@antfu/eslint-config';

export default antfu({
  formatters: <%= enablePrettier ? false : true %>,
  <%_ if (frame === 'react' || frame === 'preact') { _%>
  react: true,
  <%_ } else if (frame === 'vue') { _%>
  vue: true,
  <%_ } else if (frame === 'svelte') { _%>
  svelte: true,
  <%_ } else if (frame === 'solid') { _%>
  solid: true,
  <%_ } _%>
  ignores: [
    'patches',
    'playgrounds',
    '**/cache',
    '**/dist',
    '**/.temp',
    '**/*.svg',
  ],
  <%_ if (!enablePrettier) { _%>
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: true,
  },
  <%_ } _%>
});
`.trimStart();

export default {
  default: _default,
};
