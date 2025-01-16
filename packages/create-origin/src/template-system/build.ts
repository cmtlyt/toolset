import type { TemplateState } from '$/types';
import type { FinishedTemplateInfo, TemplateInfo } from './types';
import { resolve as pathResolve } from 'node:path';
import { BUILDER_CONFIG_PATH } from '$/constant/builder-config';
import { OVERREAD_FRAME_USE_PLUGIN_CODE } from '$/constant/import-expression';
import { getItem, setItem } from '$/store';
import { getFramePlugin, getFramePluginImport, getFramePluginUseFunc } from '$/template-system/dependencie-map';
import { Builder, Frame } from '$/types';
import { render } from 'ejs';
import { outputFile, readJSON } from 'fs-extra/esm';
import { buildFilePath, buildTemplateInfo, buildTemplateInfos, getDepMap, getScripts, getTemplate, parseTemplate } from './utils';

export async function buildTemplateInfoList() {
  const templateState = getItem('templateState');
  const templateInfoList = getItem('templateInfoList');
  const finishedTemplateInfoList: FinishedTemplateInfo[] = [];
  await Promise.all(templateInfoList.map(async (item) => {
    if (!item.localPath)
      return void 0;

    const content = await readJSON(item.localPath);

    if ((item as TemplateInfo).parse) {
      const fileMap = parseTemplate(item as any, content, templateState);
      if (typeof fileMap === 'string') {
        finishedTemplateInfoList.push(buildTemplateInfo({ ...item, content: fileMap }));
      }
      else {
        Object.entries<string>(fileMap).forEach(([filePath, content]) => {
          finishedTemplateInfoList.push(buildTemplateInfo({ ...item, content, filePath }));
        });
      }
    }
    else {
      finishedTemplateInfoList.push(buildTemplateInfo({ ...item, content: getTemplate(content, templateState) }));
    }
  }));
  setItem('finishedTemplateInfoList', buildTemplateInfos(finishedTemplateInfoList, templateState));
}

function buildTemplateState() {
  const config = getItem('projectConfig');
  const { builderId = Builder.vite, frameId = Frame.react } = config;
  const framePlugin = getFramePlugin(builderId, frameId).name;
  const pluginUseCode = OVERREAD_FRAME_USE_PLUGIN_CODE[builderId][frameId] || frameId;
  const templateState: TemplateState = {
    builder: builderId,
    builderConfig: {
      frameName: OVERREAD_FRAME_USE_PLUGIN_CODE[builderId][frameId] || frameId,
      pluginUseCode,
      framePlugin,
      frameImport: getFramePluginImport(builderId, frameId, framePlugin),
      pluginNeedCall: getFramePluginUseFunc(builderId, frameId, framePlugin, pluginUseCode),
    },
    builderConfigPath: buildFilePath({ filePath: BUILDER_CONFIG_PATH[builderId] } as any, config),
    ...getDepMap(config),
    enableEslint: config.enableEslint,
    enablePrettier: config.enablePrettier,
    enableTypeScript: config.enableTypeScript,
    frame: config.frameId,
    projectName: config.projectName,
    scripts: getScripts(config),
  };
  setItem('templateState', templateState);
}

async function renderTemplate() {
  const templateState = getItem('templateState');
  const config = getItem('projectConfig');
  const { outputPath } = config;
  const finishedTemplateInfoList = getItem('finishedTemplateInfoList');
  await Promise.all(finishedTemplateInfoList.map(async (item) => {
    const { content, filePath } = item;
    const targetPath = pathResolve(outputPath, filePath);
    const fileContent = await render(content, templateState, { async: true, beautify: false });
    return outputFile(targetPath, fileContent);
  }));
}

export async function buildTemplate() {
  buildTemplateState();
  await buildTemplateInfoList();
  await renderTemplate();
}
