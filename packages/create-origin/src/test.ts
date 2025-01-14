import fs from 'node:fs';
import { downloadTemplateList, getSourceTemplateList } from '.';
import { Builder, Frame } from './types';

fs.existsSync('./temp') || fs.mkdirSync('./temp');

downloadTemplateList(getSourceTemplateList({
  projectName: 'test',
  builderId: Builder.vite,
  frameId: Frame.vue,
}));
