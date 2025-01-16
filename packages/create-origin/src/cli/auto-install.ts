import { exec } from 'node:child_process';

export async function autoInstall(dir: string, packageManager: string) {
  return new Promise((res, rej) => {
    exec(`${packageManager} install`, { cwd: dir }, (err) => {
      if (err)
        rej(err);
      res(null);
    });
  });
}
