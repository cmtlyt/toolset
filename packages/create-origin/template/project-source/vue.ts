const mainScript = `import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

createApp(App).mount('#app');
`;

const style = `body {
  margin: 0;
}`;

const appScript = `<script setup<%= enableTypeScript ? ' lang="js"' : ''%>>
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

const typescript = {
  'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= builder %> + Vue + TS</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`,
  'src/main.ts': mainScript,
  'src/app.vue': appScript,
  'src/style.css': style,
  'src/vite-env.d.ts': '/// <reference types="vite/client" />\n',
};

const javascript = {
  'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= builder %> + Vue</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
`,
  'src/main.js': mainScript,
  'src/app.vue': appScript,
  'src/style.css': style,
};

export default {
  default: typescript,
  typescript,
  javascript,
};
