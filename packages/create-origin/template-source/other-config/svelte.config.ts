/**
 * svelte 配置文件
 *
 * 以 `构建器-类型` 为 key 索引
 */

const viteConfig = `
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
}
`.trimStart();

const vite = {
  'svelte.config.#{ext}': viteConfig,
};

export default {
  default: vite,
  vite,
};
