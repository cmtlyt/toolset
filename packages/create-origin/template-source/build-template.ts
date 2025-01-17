import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// @ts-expect-error no type
import lint from 'ejs-lint';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePath = path.resolve(__dirname, '../template');

fs.existsSync(templatePath) && fs.rmSync(templatePath, { recursive: true, force: true });
fs.mkdirSync(templatePath);

const ignoreLint = ['other-config/package.json'];

glob('./**/*.ts', { cwd: __dirname, absolute: true }).then((paths) => {
  paths.map(async (filePath) => {
    if (__filename.endsWith(filePath))
      return;
    const sourcePath = filePath;
    const config = (await import(sourcePath)).default;
    const fileName = sourcePath.split(/[\\/]/).slice(-2).join(path.sep).replace(/\.ts$/, '.json');
    const targetDir = path.resolve(templatePath, path.dirname(fileName));
    fs.existsSync(targetDir) || fs.mkdirSync(targetDir, { recursive: true });
    const targetPath = path.resolve(templatePath, fileName);
    const json = JSON.stringify(config);
    if (!ignoreLint.includes(fileName.replaceAll(path.sep, '/'))) {
      const err = lint(json);
      if (err) {
        console.error(filePath, err, fileName);
      }
    }
    fs.writeFileSync(targetPath, json, 'utf-8');
  });
});
