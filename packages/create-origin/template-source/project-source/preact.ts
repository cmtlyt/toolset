const extname = `<%= enableTypeScript ? 'tsx' : 'jsx' %>`;

const indexHtml = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= builder %> + Preact<%= enableTypeScript ? ' + TS' : '' %></title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.${extname}"></script>
  </body>
</html>
`.trimStart();

const main = `
import { render } from 'preact';
import './index.css';
import { App } from './app.${extname}';

render(<App />, document.getElementById('app')!);
`.trimStart();

const app = `
import { useState } from 'preact/hooks';
import './app.css';

export function App() {
  const [projectName, setProjectName] = useState(<%= projectName %>);

  return (
    <section>
      <h1>{projectName}</h1>
    </section>
  )
}
`.trimStart();

const appCss = `
#app {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
`.trimStart();

const indexCss = `
body {
  margin: 0;
}
`.trimStart();

const typescript = {
  'index.html': indexHtml,
  'src/main.tsx': main,
  'src/app.tsx': app,
  'src/app.css': appCss,
  'src/index.css': indexCss,
};

const javascript = {
  'index.html': indexHtml,
  'src/main.jsx': main,
  'src/app.jsx': app,
  'src/app.css': appCss,
  'src/index.css': indexCss,
};

export default {
  default: javascript,
  typescript,
  javascript,
};
