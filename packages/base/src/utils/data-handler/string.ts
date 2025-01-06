function _replaceOne(str: string, pattern: string | RegExp, replacer: (...args: string[]) => string | Promise<string>) {
  return new Promise<string>((resolve, reject) => {
    pattern = new RegExp(pattern);
    const match = str.match(pattern);
    if (!match) {
      resolve(str);
      return;
    }
    (async () => {
      try {
        const repStr = (await (replacer(...Array.from(match)) as Promise<string>).catch(reject))!;
        resolve(str.replace(pattern, repStr));
      }
      catch (e) {
        reject(e);
      }
    })();
  });
}

/**
 * 异步替换字符串
 * @param str 原字符串
 * @param pattern 匹配正则或字符串
 * @param replacer 替换函数
 */
export async function asyncReplace(
  str: string,
  pattern: string | RegExp,
  replacer: ((matchString: string, ...args: string[]) => string | Promise<string>) | string,
) {
  if (typeof replacer === 'string')
    return str.replace(pattern, replacer);
  if (typeof replacer !== 'function') {
    throw new TypeError('replacer 必须是字符串或函数');
  }
  if (typeof pattern === 'string') {
    return _replaceOne(str, pattern, replacer);
  }
  if (pattern instanceof RegExp) {
    if (!pattern.global) {
      return _replaceOne(str, pattern, replacer);
    }
    return new Promise<string>((resolve, reject) => {
      let match: any;
      let lastIndex = 0;
      const proms = [];
      match = pattern.exec(str);
      while (match !== null) {
        // @ts-expect-error 通过 Array.from 直接转换 match
        const prom = replacer(...Array.from(match));
        const preStr = str.slice(lastIndex, match.index);
        lastIndex = match.index + match[0].length;
        proms.push(preStr, prom);
        match = pattern.exec(str);
      }
      const lastStr = str.slice(lastIndex);
      proms.push(lastStr);
      (async () => {
        const temp = await Promise.all(proms).catch(reject);
        if (!temp)
          return;
        resolve(temp.join(''));
      })();
    });
  }
  return str;
}
