import { warning } from '@com/warning';

import { isHttpsUrlString, cacheByReturn } from '@/utils';

const hasCopyCommand = cacheByReturn(() => {
  return document.queryCommandSupported?.('copy');
});

const hasPasteCommand = cacheByReturn(() => {
  return document.queryCommandSupported?.('paste');
});

const isCopyable = cacheByReturn(() => {
  return isHttpsUrlString(location.href) && (!!navigator.clipboard?.writeText || hasCopyCommand() || false);
});

const isPasteable = cacheByReturn(() => {
  return isHttpsUrlString(location.href) && (!!navigator.clipboard?.readText || hasPasteCommand() || false);
});

const isClearable = isCopyable;

const copy = cacheByReturn((): ((text: string) => void) => {
  if (isCopyable()) {
    return (text) => {
      navigator.clipboard.writeText(text);
    };
  } else if (hasCopyCommand()) {
    return (text) => {
      const input = document.createElement('input');
      input.setAttribute('value', text);
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
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
    return () => {
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.select();
      document.execCommand('paste');
      const text = input.value;
      document.body.removeChild(input);
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
    return () => {
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
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
