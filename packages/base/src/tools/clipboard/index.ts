import { warning } from '../../common/warning';
import { isHttpsUrlString, safeGetGlobal } from '../../utils';
import { cacheByReturn } from '../../cirDep';

const hasExecCommand = cacheByReturn(() => {
  return typeof safeGetGlobal().document?.execCommand === 'function';
});

const hasCopyCommand = cacheByReturn(() => {
  return safeGetGlobal().document?.queryCommandSupported?.('copy') && hasExecCommand();
});

const hasPasteCommand = cacheByReturn(() => {
  return safeGetGlobal().document?.queryCommandSupported?.('paste') && hasExecCommand();
});

const isNavCopyable = cacheByReturn(() => {
  return (isHttpsUrlString(safeGetGlobal().location?.href) && !!navigator.clipboard?.writeText) || false;
});

const isCopyable = cacheByReturn(() => {
  return isNavCopyable() || hasCopyCommand() || false;
});

const isNavPasteable = cacheByReturn(() => {
  return (isHttpsUrlString(safeGetGlobal().location?.href) && !!navigator.clipboard?.readText) || false;
});

const isPasteable = cacheByReturn(() => {
  return isNavPasteable() || hasPasteCommand() || false;
});

const isNavClearable = isNavCopyable;

const isClearable = isCopyable;

const copy = cacheByReturn((): ((text: string) => void) => {
  if (isNavCopyable()) {
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
  if (isNavPasteable()) {
    return () => {
      return navigator.clipboard.readText();
    };
  } else if (hasPasteCommand()) {
    const doc = safeGetGlobal().document;
    return () => {
      const input = doc.createElement('input');
      doc.body.appendChild(input);
      input.select();
      try {
        doc.execCommand('paste');
      } catch (e) {
        return Promise.reject('paste not supported');
      }
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
  if (isNavClearable()) {
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
