import { CookieOptions, generateCookieInfo } from '@/utils';

export const cookie = {
  get(key: string) {
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${key}=`))
      .split('=')[1];
  },
  set(key: string, value: string, options: CookieOptions = {}) {
    document.cookie = `${key}=${value};${generateCookieInfo(options)}`;
  },
  remove(key: string) {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
};
