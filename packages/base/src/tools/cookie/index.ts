import { CookieOptions, generateCookieInfo, safeGetGlobal } from '../../utils';

export const cookie = {
  get(key: string) {
    return (
      safeGetGlobal()
        .document?.cookie.split('; ')
        .find((row: string) => row.startsWith(`${key}=`))
        ?.split('=')[1] || ''
    );
  },
  set(key: string, value: string, options: CookieOptions = {}) {
    const doc = safeGetGlobal().document;
    if (!doc?.cookie) return;
    doc.cookie = `${key}=${value};${generateCookieInfo(options)}`;
  },
  remove(key: string) {
    const doc = safeGetGlobal().document;
    if (!doc?.cookie) return;
    doc.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
};
