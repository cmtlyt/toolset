import { warning } from '@com/warning';

import { isHttpsUrlString, cacheByReturn, safeGetGlobal } from '@/utils';

const hasCopyCommand = cacheByReturn(() => {
  return safeGetGlobal().document?.queryCommandSupported?.('copy');
});

const hasPasteCommand = cacheByReturn(() => {
  return safeGetGlobal().document?.queryCommandSupported?.('paste');
});

const isCopyable = cacheByReturn(() => {
  return isHttpsUrlString(safeGetGlobal().location?.href)
    ? !!navigator.clipboard?.writeText || hasCopyCommand() || false
    : hasPasteCommand() || false;
});

const isPasteable = cacheByReturn(() => {
  return (
    isHttpsUrlString(safeGetGlobal().location?.href) && (!!navigator.clipboard?.readText || hasPasteCommand() || false)
  );
});

const isClearable = isCopyable;

const copy = cacheByReturn((): ((text: string) => void) => {
  if (isCopyable()) {
    return (text) => {
      navigator.clipboard.writeText(text);
    };
  } else if (hasCopyCommand()) {
    const doc = safeGetGlobal().document;
    return (text) => {
      const input = doc.createElement('input');
      input.setAttribute('value', text);
      doc.body.appendChild(input);
      input.select();
      doc.execCommand('copy');
      doc.body.removeChild(input);
    };
  }
  return (text) => {
    warning('copy not supported:> ', text);
  };
});

const paste = cacheByReturn((): (() => Promise<string>) => {
  if (isPasteable()) {
    return () => {
      return navigator.clipboard.readText();
    };
  } else if (hasPasteCommand()) {
    const doc = safeGetGlobal().document;
    return () => {
      const input = doc.createElement('input');
      doc.body.appendChild(input);
      input.select();
      doc.execCommand('paste');
      const text = input.value;
      doc.body.removeChild(input);
      return Promise.resolve(text);
    };
  }
  return () => {
    warning('paste not supported');
    return Promise.reject('paste not supported');
  };
});

const clear = cacheByReturn((): (() => void) => {
  if (isClearable()) {
    return () => {
      navigator.clipboard.writeText('');
    };
  } else if (hasCopyCommand()) {
    const doc = safeGetGlobal().document;
    return () => {
      const input = doc.createElement('input');
      doc.body.appendChild(input);
      input.select();
      doc.execCommand('copy');
      doc.body.removeChild(input);
    };
  }
  return () => {
    warning('clear not supported');
  };
});

export const clipboard = {
  copy,
  paste,
  clear,
  get isCopyable() {
    return isCopyable();
  },
  get isPasteable() {
    return isPasteable();
  },
  get isClearable() {
    return isClearable();
  },
};
