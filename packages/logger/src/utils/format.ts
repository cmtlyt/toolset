export function onelineFormat(content: string) {
  return content.replace(/\s*?\n\s*/g, ' ');
}

export const formatContent = (() => {
  const usingString = ['function', 'number', 'boolean', 'string', 'symbol', 'undefined'];

  return (content: unknown): string => {
    if (usingString.includes(typeof content))
      return String(content);
    if (content instanceof Set)
      return formatSetData(content);
    if (content instanceof Map)
      return formatMapData(content);
    if (content instanceof Error)
      return content.stack || content.message;
    try {
      return JSON.stringify(content, null, 2);
    }
    catch {
      return String(content);
    }
  };
})();

export function formatMapData(source: Map<unknown, unknown>): string {
  const data = [...source];
  const content = data.map(([key, value]) => onelineFormat(`{ ${formatContent(key)} => ${formatContent(value)} },`));
  return `Map(${content.length}) [\n  ${[...content].join('\n  ')}\n]`;
}

export function formatSetData(source: Set<unknown>): string {
  const data = [...source];
  const content = data.map(item => formatContent(item)).map(item => `  ${onelineFormat(item)},\n`);
  return `Set(${content.length}) {\n${content.join('')}}`;
}
