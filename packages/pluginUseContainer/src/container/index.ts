import { WebContainer } from '@webcontainer/api';
import { unGzip } from '@cmtlyt/string-zip';
import { IndexedDBStorage } from '@cmtlyt/storage';

import { EntityItem } from './type';

async function loadSource(container: WebContainer, sourceTree: EntityItem[], parentPath = '') {
  for (const idx in sourceTree) {
    const item = sourceTree[idx];
    const path = parentPath + item.name;
    if (item.kind === 'file') {
      await container.fs.writeFile(path, item.content, { encoding: 'utf-8' });
    } else if (item.kind === 'dir') {
      await container.fs.mkdir(path, { recursive: true });
      await loadSource(container, item.children, `${parentPath}/${item.name}/`);
    }
  }
}

async function loadSourceDirTree(container: WebContainer, key: string, parentPath = '') {
  if (!window[key]?.sourceDirTree) return;
  const sourceDirTree: EntityItem[] = JSON.parse(await unGzip(window[key].sourceDirTree));
  if (parentPath) await container.fs.mkdir(parentPath, { recursive: true });
  return loadSource(container, sourceDirTree, parentPath);
}

function onceFunc<T extends (...args: any[]) => any>(func: T): T {
  let called = false;
  return function (...args: any[]) {
    if (called) return;
    called = true;
    return func(...args);
  } as T;
}

async function runningSource(container: WebContainer) {
  await (
    await container.spawn('pnpm', ['init'])
  ).exit;
  container.spawn('pnpx', ['vite', './source']);
  return new Promise<string>((resolve, reject) => {
    container.on(
      'server-ready',
      onceFunc((_, url) => resolve(url)),
    );
    container.on('error', onceFunc(reject));
  });
}

function createIframe(url: string) {
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.style.width = '100vw';
  iframe.style.height = '100vh';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);
  return iframe;
}

async function runningBackend(container: WebContainer) {
  const cmds = window.__backendFileSystem__?.runCmds;
  if (cmds) {
    return new Promise((resolve, reject) => {
      (async () => {
        container.on(
          'server-ready',
          onceFunc((_, url) => resolve(url)),
        );
        container.on('error', onceFunc(reject));
        for (const cmd of cmds) {
          const [_cmd, ...args] = cmd.split(' ');
          const process = await container.spawn(_cmd, args, { cwd: 'backend' });
          process.output.pipeTo(
            new WritableStream({
              write(chunk) {
                console.log(chunk);
              },
            }),
          );
          await process.exit;
        }
      })();
    });
  }
  return Promise.reject('不需要运行后端');
}

async function initStorage(container: WebContainer, dbName: string) {
  const storage = new IndexedDBStorage({ dbName, autoSaveDelay: 0 });

  const filePaths = await storage.getKeys();

  for (const idx in filePaths) {
    const filePath = filePaths[idx];
    const content = await storage.getItem(filePath);
    const path = filePath.split('/').slice(0, -1).join('/');
    await container.fs.mkdir(path, { recursive: true });
    await container.fs.writeFile(filePath, content, { encoding: 'utf-8' });
  }

  return storage;
}

async function createStorageWatcher(container: WebContainer, dir: string, storage: IndexedDBStorage) {
  await container.fs.mkdir(dir, { recursive: true });

  container.fs.watch(dir, { encoding: 'utf-8' }, (event, filename) => {
    if (event === 'rename') return;

    const filePath = dir + filename;

    container.fs.readFile(filePath, 'utf-8').then(async (content) => {
      await storage.setItem(filePath, content);
      storage.forceSave();
    });
  });
}

onceFunc(() => {
  WebContainer.boot().then(async (container) => {
    const { containerConfig, backendFileSystem } = window.__globalKeyMap__ || {};

    window.exec = async function (cmd: string) {
      const [_cmd, ...args] = cmd.split(' ');

      const process = await container.spawn(_cmd, args);
      process.output.pipeTo(
        new WritableStream({
          write(chunk) {
            console.debug(chunk);
          },
        }),
      );
      await process.exit;
    };

    const frameWindow = await loadSourceDirTree(container, containerConfig).then(async () => {
      const url = await runningSource(container);

      return createIframe(url).contentWindow;
    });

    loadSourceDirTree(container, backendFileSystem, 'backend/').then(async () => {
      const dir = `backend/storage/`;

      const storage = await initStorage(container, dir);

      createStorageWatcher(container, dir, storage);

      runningBackend(container).then(
        (url) => {
          frameWindow?.postMessage({ type: 'backend-url', url }, '*');
        },
        (err) => {
          if (typeof err === 'string') return;
          console.error(err);
        },
      );
    });
  });
})();
