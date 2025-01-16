const vite = `
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
`.trim();

const rsbuild = `
{
  "compilerOptions": {
    "lib": ["DOM", "ES2020"],
    "jsx": "react-jsx",
    "target": "ES2020",
    "noEmit": true,
    "skipLibCheck": true,
    "useDefineForClassFields": true,

    /* modules */
    "module": "ESNext",
    "isolatedModules": true,
    "resolveJsonModule": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,

    /* type checking */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src"]
}
`.trimStart();

export default {
  default: vite,
  vite,
  rsbuild,
};
