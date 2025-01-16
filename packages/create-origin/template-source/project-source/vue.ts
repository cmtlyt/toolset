const mainScript = `import { createApp } from 'vue';
import './style.css';
import App from './app.vue';

createApp(App).mount('#app');
`;

const style = `body {
  margin: 0;
}
`;

const appScript = `<script setup<%- enableTypeScript ? ' lang="ts"' : ''%>>
import { ref } from 'vue';

const projectName = ref('<%= projectName %>');
</script>

<template>
  <section>
    <h1>{{ projectName }}</h1>
  </section>
</template>

<style scoped>
section {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
`;

const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/builder.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= builder %> + Vue<%= enableTypeScript ? ' + TS' : '' %></title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.<%= enableTypeScript ? 'ts' : 'js' %>"></script>
  </body>
</html>
`;

const typescript = {
  'index.html': indexHtml,
  'src/main.ts': mainScript,
  'src/app.vue': appScript,
  'src/style.css': style,
};

const javascript = {
  'index.html': indexHtml,
  'src/main.js': mainScript,
  'src/app.vue': appScript,
  'src/style.css': style,
};

export default {
  default: typescript,
  typescript,
  javascript,
};
