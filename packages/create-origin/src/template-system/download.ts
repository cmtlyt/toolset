import type { TemplateInfo } from './types';
import { getItem, setItem } from '$/store';
import { baseFiles, getBuilderTemplate, getExtendTemplate, getFrameTemplate } from '$/utils/template-map';
import { getDownloadTemplateFunc } from './utils';

/** 获取模板信息列表 */
function getTemplateInfoList() {
  const config = getItem('projectConfig');
  if (!config.frameId) {
    throw new TypeError('必须选择一个框架');
  }
  if (!config.builderId) {
    throw new TypeError('必须选择一个打包工具');
  }
  const sourceList: TemplateInfo[] = [];

  // 框架源码模板信息
  sourceList.push(getFrameTemplate(config.frameId));

  // 加载打包工具模板信息
  sourceList.push(getBuilderTemplate(config.builderId));

  // 基本模板信息
  sourceList.push(...baseFiles);

  // 工程化模板信息
  sourceList.push(...getExtendTemplate());
  return sourceList;
}

/** 下载模板列表 */
async function downloadTemplateList(templateInfoList: TemplateInfo[]) {
  const downloadTemplate = getDownloadTemplateFunc();
  return Promise.all(templateInfoList.map((item) => {
    return item.loader(downloadTemplate);
  }));
}

export async function downloadTemplates() {
  const templateInfoList = getTemplateInfoList();
  setItem('templateInfoList', templateInfoList);
  await downloadTemplateList(templateInfoList);
}
