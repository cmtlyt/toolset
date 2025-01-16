import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePath = path.resolve(__dirname, '../template');

fs.existsSync(templatePath) && fs.rmSync(templatePath, { recursive: true, force: true });
fs.mkdirSync(templatePath);

glob('./**/*.ts', { cwd: __dirname, absolute: true }).then((paths) => {
  paths.map(async (filePath) => {
    if (__filename.endsWith(filePath))
      return;
    const sourcePath = filePath;
    const config = (await import(sourcePath)).default;
    const fileName = sourcePath.split(/[\\/]/).slice(-2).join('/').replace(/\.ts$/, '.json');
    const targetDir = path.resolve(templatePath, path.dirname(fileName));
    fs.existsSync(targetDir) || fs.mkdirSync(targetDir, { recursive: true });
    const targetPath = path.resolve(templatePath, fileName);
    fs.writeFileSync(targetPath, JSON.stringify(config), 'utf-8');
  });
});
