const extname = `<%= enableTypeScript ? 'tsx' : 'jsx' %>`;

const indexHtml = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= builder %> + React<%= enableTypeScript ? ' + TS' : '' %></title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.${extname}"></script>
  </body>
</html>
`.trimStart();

const main = `
import { mount } from 'svelte';
import './app.css';
import App from './app.svelte';

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
`.trimStart();

const app = `
<script lang="ts">
export let projectName = $state('<%= projectName %>');
</script>

<main>
  <h1>{projectName}</h1>
</main>

<style>
main{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
`.trimStart();

const appCss = `
body {
  margin: 0;
}
`.trimStart();

const typescript = {
  'index.html': indexHtml,
  'src/main.ts': main,
  'src/app.svelte': app,
  'src/app.css': appCss,
};

const javascript = {
  'index.html': indexHtml,
  'src/main.js': main,
  'src/app.svelte': app,
  'src/app.css': appCss,
};

export default {
  default: javascript,
  typescript,
  javascript,
};
