import { Option, program } from 'commander';
import { version } from '../package.json';
import { createHandler } from './cli/create';
import { optionPrompt } from './cli/option-prompt';
import { SUPPORT_BUILDERS, SUPPORT_FRAMES } from './constant';
import { Registry } from './types';

function parseBoolean(value: string) {
  if (value === 'false')
    return false;
  return true;
}

program
  .name('create-origin')
  .aliases(['coa', 'origin'])
  .description('使用 origin 创建一个新项目')
  .argument('[projectName]', '项目名称')
  .version(version)
  .option('-p, --package', '创建一个 npm 包', parseBoolean)
  // ^ 基础配置
  // 构建器
  .addOption(new Option('--builder <builder>', '构建器').choices(SUPPORT_BUILDERS))
  // 框架
  .addOption(new Option('--frame <frame>', '框架').choices(SUPPORT_FRAMES))
  // ^ 扩展配置
  // eslint
  .option('--eslint [enableEslint]', '是否启用 eslint (default: true)', parseBoolean)
  // prettier
  .option('--prettier [enablePrettier]', '是否启用 prettier (default: false)', parseBoolean)
  // typescript
  .option('--typescript [enableTypeScript]', '是否启用 typescript (default: true)', parseBoolean)
  // ^ 额外配置
  // 包管理器
  .addOption(new Option('-m, --package-manager <packageManager>', '包管理器 (默认为执行命令时的包管理器)').choices(['npm', 'yarn', 'pnpm']))
  // 自动安装依赖
  .option('-i, --auto-install', '自动安装依赖 (default: false)', parseBoolean)
  // 依赖使用最新版本
  .option('-l, --use-latest-package', '所有依赖均使用最新版本 (default: false)', parseBoolean)
  .option('--no-git', '不使用 git 初始化 (default: false)', parseBoolean)
  // 模板下载地址
  .addOption(new Option('--registry', '模板下载地址').choices(Object.keys(Registry)));

program.parseAsync().then(async (command) => {
  const [projectName] = command.args;
  const options = command.opts();

  const cliOptions = {
    builderId: options.builder,
    frameId: options.frame,
    isPackage: options.package,
    projectName,
    enableEslint: options.eslint,
    enablePrettier: options.prettier,
    enableTypeScript: options.typescript,
    packageManager: options.packageManager,
    autoInstall: options.autoInstall,
    useLatestPackage: options.useLatestPackage,
    registry: options.registry,
  };

  await createHandler.call(command, cliOptions);
});
