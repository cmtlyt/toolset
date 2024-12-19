import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const __dirname = process.cwd();

fs.cpSync(path.resolve(__dirname, './template/sub-pack'), path.resolve(__dirname, './packages/sub-package'), { recursive: true });
