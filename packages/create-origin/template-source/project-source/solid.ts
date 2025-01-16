const extname = `<%= enableTypeScript ? 'tsx' : 'jsx' %>`;

const indexHtml = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/builder.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= builder %> + Solid<%= enableTypeScript ? ' + TS' : '' %></title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.${extname}"></script>
  </body>
</html>
`.trim();

const index = `
/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';
import App from './app.tsx';

const root = document.getElementById('root');

render(() => <App />, root!);
`.trimStart();

const app = `
import { createSignal } from 'solid-js'
import './app.css';

function App() {
  const [projectName, setProjectName] = createSignal('<%= projectName %>');

  return (
    <section>
      <h1>{projectName}</h1>
    </section>
  )
}

export default App;
`.trimStart();

const appCss = `
#root {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
`.trimStart();

const indexCss = `
body {
  margin: 0;
}
`.trimStart();

const typescript = {
  'index.html': indexHtml,
  'src/index.tsx': index,
  'src/app.tsx': app,
  'src/app.css': appCss,
  'src/index.css': indexCss,
};

const javascript = {
  'index.html': indexHtml,
  'src/index.jsx': index,
  'src/app.jsx': app,
  'src/app.css': appCss,
  'src/index.css': indexCss,
};

export default {
  default: javascript,
  typescript,
  javascript,
};
