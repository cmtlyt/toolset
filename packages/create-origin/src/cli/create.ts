import type { ProjectConfig } from '$/types';
import type { UserOptions } from './option-prompt';
import prompts from 'prompts';
import yoctoSpinner from 'yocto-spinner';
import { createPackage, createProject } from '..';
import { autoInstall } from './auto-install';
import { initGitRepo } from './init-git';
import { getBaseConfig, optionPrompt } from './option-prompt';
import { saveTemplate } from './template-manager';

export async function createHandler(options: Partial<ProjectConfig>, templateId?: string) {
  const userOptions = { ...options };

  const baseConfig = await getBaseConfig(userOptions, templateId);

  if (!baseConfig)
    return;

  const { useSaveConfig, isPackage, useDefaultConfig } = baseConfig;

  if (isPackage) {
    // 如果是 npm 包则不需要后续交互, 直接下载 npm 包模板
    return createPackage(baseConfig);
  }

  const finishedOptions: UserOptions = { ...baseConfig };

  if (!useSaveConfig && !useDefaultConfig) {
    const promptOptions = await optionPrompt(baseConfig);

    if (!promptOptions)
      return;

    Object.assign(finishedOptions, promptOptions);
  }

  const projectConfig = await createProject(finishedOptions);

  if (projectConfig.autoInstall) {
    const spinner = yoctoSpinner({ text: '自动安装依赖中...' }).start();
    await autoInstall(projectConfig.outputPath, projectConfig.packageManager);
    spinner.text = '依赖安装完成';
    spinner.success();
  }
  if (!projectConfig.noGit) {
    const spinner = yoctoSpinner({ text: '初始化 git 仓库中...' }).start();
    await initGitRepo(projectConfig.outputPath);
    spinner.text = 'git 仓库初始化完成';
    spinner.success();
  }

  // 使用默认配置直接跳过保存逻辑
  if (finishedOptions.useDefaultConfig)
    return;

  // 保存模板
  const { saveTemplateFlag } = await prompts({
    name: 'saveTemplateFlag',
    type: 'confirm',
    initial: false,
    message: '是否保存模板',
  });

  if (!saveTemplateFlag)
    return;

  return saveTemplate(projectConfig);
}
