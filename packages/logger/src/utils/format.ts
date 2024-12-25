export function onelineFormat(content: string) {
  return content.replace(/\s*?\n\s*/g, ' ');
}

export const formatContent = (() => {
  const usingString = ['function', 'number', 'boolean', 'string', 'symbol', 'undefined'];

  const format = (content: unknown, deepLevel = 1, isRoot = false): string => {
    if (usingString.includes(typeof content)) {
      if (!isRoot && typeof content === 'string')
        return JSON.stringify(content);
      return String(content);
    }
    if (content instanceof Set)
      return formatSetData(content, deepLevel);
    if (content instanceof Map)
      return formatMapData(content, deepLevel);
    if (content instanceof Error)
      return content.stack || content.message;
    if (Array.isArray(content))
      return formatArray(content as unknown[], deepLevel);
    try {
      return formatObject(content as Record<string, unknown>, deepLevel);
    }
    catch {
      return String(content);
    }
  };

  return (content: unknown, deepLevel = 1, isRoot = false) => {
    return format(content, deepLevel, isRoot).replace(/\s*?\n\s*?\n\s*/g, ' ');
  };
})();

export function formatArray(source: any[], deepLevel = 1) {
  return `[\n${source.map(item => `${' '.repeat(deepLevel * 2)}${formatContent(item, deepLevel + 1)},`).join('\n')}\n${' '.repeat((deepLevel - 1) * 2)}]`;
}

export function formatObject(source: Record<string, any>, deepLevel = 1): string {
  const obj = Object.create(null);
  for (const key in source) {
    obj[key] = formatContent(source[key], deepLevel + 1);
  }
  return `{\n${Object.entries(obj).map(([key, value]) => `${' '.repeat(deepLevel * 2)}${key}: ${value},`).join('\n')}\n${' '.repeat((deepLevel - 1) * 2)}}`;
}

export function formatMapData(source: Map<unknown, unknown>, deepLevel = 1): string {
  const data = [...source];
  const content = data.map(([key, value]) => onelineFormat(`{ ${formatContent(key)} => ${formatContent(value)} },`));
  return `Map(${content.length}) [\n${' '.repeat(deepLevel * 2)}${[...content].join(`\n${' '.repeat(deepLevel * 2)}`)}\n${' '.repeat((deepLevel - 1) * 2)}]`;
}

export function formatSetData(source: Set<unknown>, deepLevel = 1): string {
  const data = [...source];
  const content = data.map(item => formatContent(item)).map(item => `${' '.repeat(deepLevel * 2)}${onelineFormat(item)},\n`);
  return `Set(${content.length}) {\n${content.join('')}${' '.repeat((deepLevel - 1) * 2)}}`;
}
