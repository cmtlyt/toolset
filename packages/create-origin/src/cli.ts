import { Option, program } from 'commander';
import { version } from '../package.json';
import { cliProcess } from './cli/utils';
import { SUPPORT_BUILDERS, SUPPORT_FRAMES } from './constant';

function parseBoolean(value: string) {
  if (value === 'false')
    return false;
  return true;
}

program
  .name('create-origin')
  .alias('coa')
  .description('使用 origin 创建一个新项目')
  .argument('[projectName]', '项目名称')
  .version(version)
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
  .addOption(new Option('-m, --package-manager <packageManager>', '包管理器 (默认为执行命令时的包管理器)').choices(['npm', 'yarn', 'pnpm']).default('npm'))
  // 自动安装依赖
  .option('-i, --auto-install', '自动安装依赖 (default: false)', parseBoolean, false)
  // 依赖使用最新版本
  .option('-l, --use-latest-package', '所有依赖均使用最新版本 (default: false)', parseBoolean, false)
  // 模板下载地址
  .addOption(new Option('--registry', '模板下载地址').choices(['github']).default('github'));

program.parseAsync().then((command) => {
  const [projectName] = command.args;
  const options = command.opts();

  return cliProcess({
    builderId: options.builder,
    frameId: options.frame,
    projectName,
    enableEslint: options.eslint,
    enablePrettier: options.prettier,
    enableTypeScript: options.typescript,
    packageManager: options.packageManager,
    autoInstall: options.autoInstall,
    useLatestPackage: options.useLatestPackage,
    registry: options.registry,
  });
});
