import { createProject } from '.';
import { Builder, Frame } from './types';

createProject({
  projectName: 'test',
  builderId: Builder.vite,
  frameId: Frame.vue,
  enableTypeScript: false,
  // enableEslint: true,
  // enablePrettier: true,
});

// ejsLint('<%= a name %>');

// render('<%= name %>', { name: 'world' }, { async: true }).then(console.log);
