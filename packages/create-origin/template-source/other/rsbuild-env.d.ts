const _default = `
/// <reference types="@rsbuild/core/types" />
<%_ if (frame === 'vue') { _%>
declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  // biome-ignore lint/complexity/noBannedTypes: reason
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
<%_ } else if (frame === 'svelte') { _%>
/// <reference types="svelte" />
<%_ } _%>
`.trimStart();

export default {
  default: _default,
};
