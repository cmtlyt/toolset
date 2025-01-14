import { downloadTemplateList, getSourceTemplateList } from '.';
import { Builder, Frame } from './types';

downloadTemplateList(getSourceTemplateList({
  projectName: 'test',
  builderId: Builder.vite,
  frameId: Frame.vue,
}));
