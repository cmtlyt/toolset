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
`.trimStart();

const _defualt = `{
  "compilerOptions": ${compilerOptions}
}
`.trimStart();

const builderConfigPath = `"<%- builderConfigPath %>"`;

const vue = `
{
  "compilerOptions": ${compilerOptions},
  "include": [${builderConfigPath}]
}
`.trimStart();

const react = `
{
  "compilerOptions": ${compilerOptions},
  "include": [${builderConfigPath}]
}
`.trimStart();

const preact = `
{
  "compilerOptions": ${compilerOptions},
  "include": [${builderConfigPath}]
}
`.trimStart();

const svelte = `
{
  "compilerOptions": ${compilerOptions},
  "include": [${builderConfigPath}]
}
`.trimStart();

const solid = `
{
  "compilerOptions": ${compilerOptions},
  "include": [${builderConfigPath}]
}
`.trimStart();

export default {
  default: _defualt,
  vue,
  vueSwc: vue,
  react,
  reactSwc: react,
  preact,
  svelte,
  solid,
};
