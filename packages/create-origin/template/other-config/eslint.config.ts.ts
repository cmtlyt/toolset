const _default = `
import antfu from '@antfu/eslint-config';

export default antfu({
  formatters: <%= enablePrettier ? false : true %>,
  <% if (frame === 'react' || frame === 'preact') { %>
  react: true,
  <% } else if (frame === 'vue') { %>
  vue: true,
  <% } else if (frame === 'svelte') { %>
  svelte: true,
  <% } else if (frame === 'solid') { %>
  solid: true,
  <% } %>
  ignores: [
    'patches',
    'playgrounds',
    '**/cache',
    '**/dist',
    '**/.temp',
    '**/*.svg',
  ],
  <% if (!enablePrettier) { %>
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: true,
  },
  <% } %>
});
`.trim();

export default {
  default: _default,
};
