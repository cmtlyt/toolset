export function onelineFormat(content: string) {
  return content.replace(/\s*?\n\s*/g, ' ');
}

const { formatContent, _formatContent } = (() => {
  const usingString = ['function', 'number', 'boolean', 'string', 'symbol', 'undefined'];
  const cache = new Set<any>();

  const format = (content: unknown, deepLevel = 1, isRoot = false): string => {
    if (usingString.includes(typeof content)) {
      if (!isRoot && typeof content === 'string')
        return JSON.stringify(content);
      return String(content);
    }
    cache.add(content);
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

  const _formatContent = (content: unknown, deepLevel = 1, isRoot = false) => {
    if (cache.has(content))
      return '[Circular]';
    const result = format(content, deepLevel, isRoot).replace(/\s*?\n\s*?\n\s*/g, ' ');
    return result;
  };

  const formatContent = (content: unknown, deepLevel = 1, isRoot = false) => {
    const result = _formatContent(content, deepLevel, isRoot);
    cache.clear();
    return result;
  };

  return { formatContent, _formatContent };
})();

export { formatContent };

export function formatArray(source: any[], deepLevel = 1) {
  return `[\n${source.map(item => `${' '.repeat(deepLevel * 2)}${_formatContent(item, deepLevel + 1)},`).join('\n')}\n${' '.repeat((deepLevel - 1) * 2)}]`;
}

export function formatObject(source: Record<string, any>, deepLevel = 1): string {
  const obj = Object.create(null);
  for (const key in source) {
    obj[key] = _formatContent(source[key], deepLevel + 1);
  }
  return `{\n${Object.entries(obj).map(([key, value]) => `${' '.repeat(deepLevel * 2)}${key}: ${value},`).join('\n')}\n${' '.repeat((deepLevel - 1) * 2)}}`;
}

export function formatMapData(source: Map<unknown, unknown>, deepLevel = 1): string {
  const data = [...source];
  const content = data.map(([key, value]) => onelineFormat(`{ ${_formatContent(key)} => ${_formatContent(value)} },`));
  return `Map(${content.length}) [\n${' '.repeat(deepLevel * 2)}${[...content].join(`\n${' '.repeat(deepLevel * 2)}`)}\n${' '.repeat((deepLevel - 1) * 2)}]`;
}

export function formatSetData(source: Set<unknown>, deepLevel = 1): string {
  const data = [...source];
  const content = data.map(item => _formatContent(item)).map(item => `${' '.repeat(deepLevel * 2)}${onelineFormat(item)},\n`);
  return `Set(${content.length}) {\n${content.join('')}${' '.repeat((deepLevel - 1) * 2)}}`;
}
