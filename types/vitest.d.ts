import 'vitest';

declare module 'vitest' {
  export interface ProvidedContext {
    CI: boolean;
    env: NodeJS.ProcessEnv;
  }
}
