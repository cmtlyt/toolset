import path from 'path';
import fs from 'fs';
import { gzipSync } from 'zlib';

import { Plugin, UserConfig, mergeConfig, build, normalizePath } from 'vite';
import type { PluginContext } from 'rollup';

import type { EntityItem } from './container/type';

interface ConfigStore {
  root: string;
  base: string;
  outDir: string;
  userOutDir: string;
  runningPath: string;
}

const __dirname = import.meta.dirname;

function getDirTree(dir: string, ignoreFiles: RegExp[] = [], rootDir = dir) {
  const files = fs.readdirSync(dir);
  const dirTree: EntityItem[] = [];

  const checkedFiles = files.filter((file) => {
    return !checkIsIgnoreFile(ignoreFiles, file);
  });

  checkedFiles.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      dirTree.push({
        name: file,
        kind: 'dir',
        children: getDirTree(filePath, ignoreFiles, rootDir),
      });
    } else {
      dirTree.push({
        name: file,
        kind: 'file',
        content: fs.readFileSync(filePath, 'utf-8'),
      });
    }
  });
  return dirTree;
}

function bufferToBase64String(buffer: Buffer) {
  return buffer.toString('base64');
}

interface InjectInfo {
  id?: string;
  globalKey?: string;
  data?: Record<string, any>;
  source?: string;
  useFile?: boolean;
  filename?: string;
  injectTo?: 'head-prepend' | 'head' | 'body' | 'body-prepend';
  loadMethods?: 'defer' | 'async';
}

interface InjectData extends InjectInfo {
  globalKey: string;
  data?: Record<string, any>;
}

interface InjectScript extends InjectInfo {
  source: string;
}

type InjectDataOrScript = InjectData | InjectScript;

export function injectSourcePlugin(options: { source?: InjectDataOrScript[] }): Plugin {
  const { source = [] } = options;
  const configStore = { base: '' };

  return {
    name: 'inject-config',
    generateBundle(_optputOptions, bundle) {
      source
        .filter((item) => item.useFile)
        .forEach((item) => {
          if (!item.filename) return;
          bundle[item.filename] = {
            type: 'chunk',
            fileName: item.filename,
            code: item.globalKey ? `window.${item.globalKey} = ${JSON.stringify(item.data)};` : item.source,
            map: null,
            modules: {},
            facadeModuleId: null,
            isEntry: false,
            isDynamicEntry: false,
            isImplicitEntry: false,
            dynamicImports: [],
            imports: [],
            importedBindings: {},
            referencedFiles: [],
            implicitlyLoadedBefore: [],
            exports: [],
            preliminaryFileName: item.filename,
            sourcemapFileName: null,
            moduleIds: [],
            name: item.filename,
          };
        });
    },
    configResolved(config) {
      configStore.base = config.base;
    },
    transformIndexHtml() {
      return source.map((item) => {
        const { globalKey, useFile, filename, data, injectTo, loadMethods = '', id } = item;
        if (useFile) {
          return {
            tag: 'script',
            injectTo: injectTo || 'head-prepend',
            attrs: { id, src: `${configStore.base}${filename}`, [loadMethods]: !!loadMethods },
          };
        }
        return {
          tag: 'script',
          injectTo: injectTo || 'head-prepend',
          attrs: { id, type: 'text/javascript' },
          children: `window.${globalKey} = ${JSON.stringify(data)}`,
        };
      });
    },
  };
}

const ignoreFiles = [
  'node_modules',
  'dist',
  '.git',
  '.gitignore',
  '.vscode',
  '.DS_Store',
  '.idea',
  '.gitlab-ci.yml',
  'README.md',
  'pnpm-lock.yaml',
  'yarn.lock',
  'package-lock.json',
];

function checkIsIgnoreFile(ignoreFiles: RegExp[], file: string) {
  return ignoreFiles.some((ignore) => ignore.test(file));
}

async function generateBackendFileTree(
  configStore: ConfigStore,
  backend: BuildContainerOptions['backend'],
): Promise<string> {
  if (!backend) return '';
  const { runningPath } = configStore;
  const { path: backendPath, ignoreFiles: extIgnoreFiles = [] } = backend;

  const resolvedBackendPath = path.resolve(runningPath, backendPath);

  const fulfilledIgnoreFiles: RegExp[] = [...ignoreFiles, ...extIgnoreFiles].map((item) => new RegExp(item));

  const dirTree = getDirTree(resolvedBackendPath, fulfilledIgnoreFiles);

  return JSON.stringify(dirTree);
}

async function getBuildContainerConfig(
  options: BuildContainerOptions,
  configStore: ConfigStore,
  injectDirTree: string,
  backend: BuildContainerOptions['backend'],
): Promise<UserConfig> {
  const { container = {} } = options;
  const { globalKey = '__containerConfig__' } = container;
  const {
    filename: backendFilename = 'backendFileSystem.js',
    globalKey: backendGlobalKey = '__backendFileSystem__',
    runCmds = [],
  } = backend || {};
  const backendCode = await generateBackendFileTree(configStore, backend);

  return {
    root: normalizePath(path.resolve(__dirname, './container')),
    base: configStore.base,
    plugins: [
      injectSourcePlugin({
        source: [
          {
            source: fs.readFileSync(path.resolve(__dirname, './container/index.umd.js'), { encoding: 'utf-8' }),
            useFile: true,
            filename: 'container.js',
            loadMethods: 'defer',
            injectTo: 'body',
          },
          {
            globalKey: '__globalKeyMap__',
            data: { containerConfig: globalKey, backendFileSystem: backendGlobalKey },
          },
          {
            globalKey,
            data: { sourceDirTree: injectDirTree },
            useFile: true,
            filename: 'containerConfig.js',
            loadMethods: 'async',
          },
          ...(backendCode
            ? [
                {
                  globalKey: backendGlobalKey!,
                  data: { sourceDirTree: bufferToBase64String(gzipSync(backendCode)), runCmds },
                  useFile: true,
                  filename: backendFilename,
                  loadMethods: 'async' as const,
                },
              ]
            : []),
        ],
      }),
    ],
    build: {
      outDir: configStore.userOutDir,
    },
  };
}

function transformSourceConfig(config: UserConfig, configStore: ConfigStore) {
  return mergeConfig(config, {
    build: {
      outDir: normalizePath(path.resolve(configStore.userOutDir, './source')),
    },
  });
}

async function getSourceDirTree(outDir: string) {
  const sourceDirTree = getDirTree(outDir);
  sourceDirTree.push({
    name: 'package.json',
    kind: 'file',
    content: JSON.stringify({ name: 'container', version: '0.0.1' }),
  });
  const sourceDirTreeStr = JSON.stringify(sourceDirTree);
  return bufferToBase64String(gzipSync(sourceDirTreeStr));
}

type IgnoreConfig = string | RegExp;

interface BuildContainerOptions {
  container?: {
    globalKey?: string;
  };
  backend?: {
    path: string;
    filename?: string;
    globalKey?: string;
    ignoreFiles?: IgnoreConfig[];
    runCmds: string[];
  };
}

export function buildContainerPlugin(options: BuildContainerOptions = {}): Plugin {
  const { backend } = options;

  const runningPath = process.cwd();
  const configStore = { runningPath } as ConfigStore;

  return {
    name: 'build-container',
    apply: 'build',

    config(config) {
      configStore.userOutDir =
        config.build?.outDir || normalizePath(path.resolve(config.root || runningPath, './dist'));
      if (!path.isAbsolute(configStore.userOutDir)) {
        configStore.userOutDir = normalizePath(path.resolve(config.root || runningPath, configStore.userOutDir));
      }
      fs.rmSync(configStore.userOutDir, { recursive: true, force: true });
      return transformSourceConfig(config, configStore);
    },
    configResolved(config) {
      configStore.root = config.root;
      configStore.base = config.base;
      configStore.outDir = config.build.outDir;
    },
    async closeBundle(this: PluginContext) {
      const userOutDirTree = await getSourceDirTree(configStore.userOutDir);
      const containerBuildConfig = await getBuildContainerConfig(options, configStore, userOutDirTree, backend);
      await build(containerBuildConfig);
    },
  };
}
