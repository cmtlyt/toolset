import type { FinishedTemplateInfo, TemplateInfo } from '$/template-system/types';
import type { ProjectConfig, TemplateState } from '$/types';

interface Store {
  templateState: TemplateState;
  projectConfig: ProjectConfig;
  finishedTemplateInfoList: FinishedTemplateInfo[];
  templateInfoList: TemplateInfo[];
}

const store = {} as Store;

export function getItem<K extends keyof Store>(key: K) {
  return store[key];
}

export function setItem<K extends keyof Store>(key: K, value: Store[K]) {
  store[key] = value;
}
