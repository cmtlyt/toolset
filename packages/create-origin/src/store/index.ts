import type { FinishedTemplateInfo, TemplateInfo } from '$/template-system/types';
import type { CallOption, OriginConfig, ProjectConfig, TemplateState } from '$/types';
import type { Spinner } from 'yocto-spinner';

interface Store {
  templateState: TemplateState;
  projectConfig: ProjectConfig;
  finishedTemplateInfoList: FinishedTemplateInfo[];
  templateInfoList: TemplateInfo[];
  spinner: Spinner;
  originConfig: OriginConfig;
  localExistsTemplate: boolean;
  callOption: CallOption;
}

const store = {} as Store;

export function getItem<K extends keyof Store>(key: K) {
  return store[key];
}

export function setItem<K extends keyof Store>(key: K, value: Store[K]) {
  store[key] = value;
}
