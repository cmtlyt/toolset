const compilerOptions = `
{
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  }
`.trim();

const _defualt = `{
  "compilerOptions": ${compilerOptions}
}
`.trim();

const vue = `
{
  "compilerOptions": ${compilerOptions},
  "include": ["vite.config.ts"]
}
`.trim();

export default {
  default: _defualt,
  vue,
};
