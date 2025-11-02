#!/usr/bin/env node

import { defineCommand, runMain } from 'citty';
import { version } from '../package.json';
import { type GitDownArgsDef, runGitDown } from './cli/gd';

/** CLI命令主入口 */
const main = defineCommand<GitDownArgsDef>({
  meta: {
    name: 'gd',
    description: '下载 GitHub 仓库文件或目录',
    version,
  },
  args: {
    url: {
      type: 'positional',
      description: 'GitHub 仓库URL或文件/目录URL',
      required: true,
    },
    output: {
      type: 'string',
      description: '指定完整的输出路径，支持相对或绝对路径 (例如: ./path 或 /path)',
      alias: ['o', 'out'],
    },
    branch: {
      type: 'string',
      description: '指定要下载的分支名称',
      alias: ['b'],
    },
    help: {
      type: 'boolean',
      description: '显示帮助信息',
      alias: ['h'],
      default: false,
    },
    name: {
      type: 'positional',
      description: '简便方式：指定输出文件夹名称 (类似 git clone 的用法)',
      required: false,
    },
  },
  async run({ args }) {
    console.warn('主分支默认是 main，如果需要下载其他分支，请使用 -b 参数指定分支名称');
    await runGitDown(args);
  },
});

runMain(main);
