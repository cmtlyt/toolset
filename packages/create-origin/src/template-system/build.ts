import type { TemplateState } from '$/types';
import type { FinishedTemplateInfo, TemplateInfoWithParse } from './types';
import { resolve as pathResolve } from 'node:path';
import { getItem, setItem } from '$/store';
import { getFramePlugin, getFramePluginImport } from '$/template-system/dependencie-map';
import { Builder, Frame } from '$/types';
import { render } from 'ejs';
import { outputFile, readJSON } from 'fs-extra/esm';
import { buildTemplateInfo, getDepMap, getScripts, getTemplate, parseTemplate } from './utils';

export async function buildTemplateInfoList() {
  const templateState = getItem('templateState');
  const templateInfoList = getItem('templateInfoList');
  const finishedTemplateInfoList: FinishedTemplateInfo[] = [];
  await Promise.all(templateInfoList.map(async (item) => {
    if (!item.localPath)
      return void 0;

    const content = await readJSON(item.localPath);

    if ((item as TemplateInfoWithParse).parse) {
      const fileMap = parseTemplate(item as any, content, templateState);
      Object.entries<string>(fileMap).forEach(([filePath, content]) => {
        finishedTemplateInfoList.push(buildTemplateInfo({ ...item, content, filePath }));
      });
    }
    else {
      finishedTemplateInfoList.push(buildTemplateInfo({ ...item, content: getTemplate(content, templateState) }));
    }
  }));
  setItem('finishedTemplateInfoList', finishedTemplateInfoList);
}

function buildTemplateState() {
  const config = getItem('projectConfig');
  const { builderId = Builder.vite, frameId = Frame.react } = config;
  const framePlugin = getFramePlugin(builderId, frameId);
  const templateState: TemplateState = {
    builder: builderId,
    builderConfig: {
      frameName: frameId,
      framePlugin,
      frameImport: getFramePluginImport(builderId, frameId, framePlugin),
    },
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
