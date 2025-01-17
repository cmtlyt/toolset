import type { ProjectConfig } from '$/types';
import type { Command } from 'commander';
import { ICON_MAP } from '$/constant';
import { colorize } from '$/utils/colorize';
import { addUserTemplateConfig, deleteUserTemplateConfig, getUserTemplateConfig } from '$/utils/origin-config';
import { print } from '$/utils/print';
import { throwError } from '$/utils/try-call';
import prompts from 'prompts';
import { getBuilderFrameConfig, optionPrompt } from './option-prompt';

export async function getTemplateChoices() {
  const userTemplateConfig = await getUserTemplateConfig();
  return Object.entries(userTemplateConfig).map(([name, config]) => ({ title: name, value: config }));
}

async function templateList() {
  const userTemplateChoices = await getTemplateChoices();
  print('模板列表:\n');
  print(userTemplateChoices.map(item => item.title).join('\n'), '\n');
}

async function templateDelete(name: string) {
  if (!name)
    throwError('请输入模板名');
  await deleteUserTemplateConfig(name);
  print(colorize`{green ${ICON_MAP.success} 模板 ${name} 删除成功}`);
}

async function clearTemplate() {
  await deleteUserTemplateConfig();
  print(colorize`{green ${ICON_MAP.success} 模板清空成功}`);
}

export async function saveTemplate(config: Partial<ProjectConfig>, name?: string) {
  let tempName: string = name!;
  if (!tempName) {
    while (true) {
      const { templateName } = await prompts({
        name: 'templateName',
        type: 'text',
        message: '请输入模板名',
      });
      if (!templateName.trim()) {
        print(colorize`{yellow ${ICON_MAP.warning} 模板名不能为空}`);
      }
      else {
        tempName = templateName.trim();
        break;
      }
    }
  }
  const { projectName: _p, outputPath: _o, ...saveConfig } = config;
  await addUserTemplateConfig(tempName, saveConfig);
  print(colorize`{green ${ICON_MAP.success} 模板 ${tempName} 保存成功}`);
}

export async function createTemplate(name: string) {
  if (!name)
    throwError('请输入模板名');
  const builderFrameConfig = await getBuilderFrameConfig({});
  if (!builderFrameConfig)
    return throwError('模板保存失败');
  const promptOptions = await optionPrompt({});
  if (!promptOptions)
    return throwError('模板保存失败');
  await saveTemplate(Object.assign({}, builderFrameConfig, promptOptions), name);
}

export async function templateManagerHandler(this: Command) {
  const options = this.opts();
  if (options.list) {
    return templateList();
  }
  if (options.delete) {
    return templateDelete(options.delete);
  }
  if (options.clear) {
    return clearTemplate();
  }
  if (options.create) {
    return createTemplate(options.create);
  }
}
