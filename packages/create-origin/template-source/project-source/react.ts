const extname = `<%= enableTypeScript ? 'tsx' : 'jsx' %>`;

const indexHtml = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/builder.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= builder %> + React<%= enableTypeScript ? ' + TS' : '' %></title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.${extname}"></script>
  </body>
</html>
`.trim();

const main = `
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app.${extname}';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`.trimStart();

const app = `
import { useState } from 'react';
import './app.css';

function App() {
  const [projectName, setProjectName] = useState('<%= projectName %>');

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
