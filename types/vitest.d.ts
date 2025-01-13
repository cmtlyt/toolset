import 'vitest';

declare module 'vitest' {
  export interface ProvidedContext {
    CI: boolean;
    env: NodeJS.ProcessEnv;
    GIT_PRE_COMMIT: boolean;
  }
}
