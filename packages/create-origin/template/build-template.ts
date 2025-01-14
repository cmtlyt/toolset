import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

glob('./**/*.ts', { cwd: __dirname, absolute: true }).then((paths) => {
  paths.map(async (path) => {
    if (__filename.endsWith(path))
      return;
    const sourcePath = path;
    const config = (await import(sourcePath)).default;
    const targetPath = sourcePath.replace(/\.ts$/, '.json');
    fs.writeFileSync(targetPath, JSON.stringify(config, null, 2), 'utf-8');
  });
});
