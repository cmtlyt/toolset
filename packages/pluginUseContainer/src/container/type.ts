interface FileEntity {
  name: string;
  kind: 'file';
  content: string;
}

interface DirEntity {
  name: string;
  kind: 'dir';
  children: EntityItem[];
}

export type EntityItem = FileEntity | DirEntity;

interface ContainerConfig {
  sourceDirTree: string;
  [key: string]: any;
}

interface BackendFileSystem {
  sourceDirTree: string;
  runCmds: string[];
  [key: string]: any;
}

declare global {
  interface Window {
    __containerConfig__: ContainerConfig;
    __backendFileSystem__: BackendFileSystem;
    __globalKeyMap__: {
      containerConfig: string;
      backendFileSystem: string;
    };
    [key: string]: any;
  }
}
