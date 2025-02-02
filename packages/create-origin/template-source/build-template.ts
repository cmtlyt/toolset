import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// @ts-expect-error no type
import lint from 'ejs-lint';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);

const templatePath = path.resolve(__dirname, '../template');

fs.existsSync(templatePath) && fs.rmSync(templatePath, { recursive: true, force: true });
fs.mkdirSync(templatePath);

const ignoreLint = ['other-config/package.json'];

glob('./**/*.ts', { cwd: __dirname, absolute: true }).then((paths) => {
  paths.map(async (filePath) => {
    if (__filename.endsWith(filePath))
      return;
    const sourcePath = path.relative(__dirname, filePath);
    const sourceRelativePath = `.${path.sep}${path.relative(__dirname, filePath)}`;
    const config = require(sourceRelativePath).default;
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
