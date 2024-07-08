import { expect, it, describe } from 'vitest';
import { getArray } from '../src/utils';

describe('@cmtlyt/base', () => {
  describe('utils', () => {
    it('getArray', () => {
      expect(getArray([])).toStrictEqual([]);
      expect(getArray([1, 2, 3])).toStrictEqual([1, 2, 3]);
      expect(getArray(1)).toEqual([1]);
    });
  });
});
