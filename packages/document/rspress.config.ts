import path from 'node:path';

import { defineConfig } from 'rspress/config';
import { pluginPreview } from '@rspress/plugin-preview';
import { pluginPlayground } from '@rspress/plugin-playground';
import readingTime from 'rspress-plugin-reading-time';
import live2d from 'rspress-plugin-live2d';
import ghPages from 'rspress-plugin-gh-pages';
import fileTree from 'rspress-plugin-file-tree';
import { globSync } from 'glob';

import live2dModels from './live2d.model.json';

const resolve = (url: string) => path.resolve(__dirname, url);

const config: any = defineConfig({
  root: resolve('./docs'),
  base: '/toolset/',
  logo: '/utils-rabbit.png',
  icon: '/logo.png',
  logoText: '@cmtlyt',
  title: 'CL文档',
  description: '@cmtlyt 生态文档',
  search: {
    versioned: true,
  },
  route: {
    cleanUrls: true,
  },
  markdown: {
    checkDeadLinks: true,
    showLineNumbers: true,
    defaultWrapCode: true,
    globalComponents: globSync('src/**/*.jsx', { absolute: true }),
  },
  builderConfig: {
    tools: {
      rspack: {
        module: {
          rules: [{ resourceQuery: /raw/, type: 'asset/source' }],
        },
      },
    },
  },
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/cmtlyt/toolset',
      },
      {
        icon: 'juejin',
        mode: 'link',
        content: 'https://juejin.cn/user/1689315510854334/posts',
      },
      {
        icon: 'wechat',
        mode: 'text',
        content: 'cmt_lyt',
      },
    ],
    lastUpdated: true,
    lastUpdatedText: '最后更新',
    nextPageText: '下一页',
    prevPageText: '上一页',
    hideNavbar: 'never',
    enableContentAnimation: true,
    enableScrollToTop: true,
    searchPlaceholderText: '搜索',
    outlineTitle: '目录',
  },
  head: [['link', { rel: 'manifest', href: '/toolset/manifest.json' }]],
  plugins: [
    pluginPreview({ defaultRenderMode: 'pure' }),
    pluginPlayground({
      defaultRenderMode: 'pure',
      include: [['@cmtlyt/base', '@cmtlyt/base']],
    }),
    readingTime({ defaultLocale: 'zh-CN' }),
    live2d({
      dockedPosition: 'left',
      mobileDisplay: false,
      sayHello: false,
      statusBar: {},
      tips: {},
      models: live2dModels as any,
    }),
    ghPages({ repo: 'https://github.com/cmtlyt/toolset.git', branch: 'document' }),
    fileTree({ initialExpandDepth: 0 }),
  ],
});

export default config;
