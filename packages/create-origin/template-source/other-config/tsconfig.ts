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
    "target": "ES2020",
    "noEmit": true,
    "skipLibCheck": true,
    "useDefineForClassFields": true,
    <%_ if (frame === 'vue') { _%>
    "jsx": "preserve",
    "jsxImportSource": "vue",
    <%_ } else if (frame === 'react') { _%>
    "jsx": "react-jsx",
    <%_ } else if (frame === 'solid') { _%>
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    <%_ } else if (frame === 'preact') { _%>
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    "paths": {
      "react": ["./node_modules/preact/compat/"],
      "react-dom": ["./node_modules/preact/compat/"]
    }
    <%_ } else if (frame === 'svelte') { _%>
    // svelte-preprocess cannot figure out whether you have a value or a type, so tell TypeScript
    // to enforce using \`import type\` instead of \`import\` for Types.
    "verbatimModuleSyntax": true,
    "useDefineForClassFields": true,
    <%_ } _%>

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
`;

export default {
  default: vite,
  vite,
  rsbuild,
};
