import { describe, expect, it } from 'vitest';
import { createPool, getPool } from '../src/tools/create-pool';

describe('pool', () => {
  it('should create a pool with the specified size', () => {
    const pool = createPool(() => ({}), 3);
    expect(pool.usableCount).toBe(3);
  });

  it('should get an item from the pool', async () => {
    const pool = createPool(() => ({ value: 'test' }), 1);
    const item = await pool.get();
    expect(item.data()).toEqual({ value: 'test' });
  });

  it('should put an item back into the pool', async () => {
    const pool = createPool(() => ({ value: 'test' }), 1);
    const item = await pool.get();
    item.unUse();
    expect(pool.usableCount).toBe(1);
  });

  it('should handle pool closure', async () => {
    const pool = createPool(() => ({ value: 'test' }), 1);
    pool.close((data) => {
      expect(data).toEqual({ value: 'test' });
    });
    expect(pool.isClose).toBe(true);
  });

  it('should reuse the same pool with the same poolId', () => {
    const poolId = 'testPool';
    const pool1 = createPool(() => ({}), 1, poolId);
    const pool2 = getPool(poolId);
    expect(pool1).toBe(pool2);
  });

  it('should throw an error when getting from a closed pool', async () => {
    const pool = createPool(() => ({ value: 'test' }), 1);
    pool.close(() => {});
    await expect(pool.get()).rejects.toThrow('池子已关闭');
  });

  it('should throw an error when putting into a closed pool', () => {
    const pool = createPool(() => ({ value: 'test' }), 1);
    pool.close(() => {});
    expect(() => pool.put({ value: 'test' })).toThrow('池子已关闭');
  });

  it('should throw an error when putting into a full pool', () => {
    const pool = createPool(() => ({ value: 'test' }), 1);
    expect(() => pool.put({ value: 'test' })).toThrow('池子已满');
  });

  it('should handle waiting items correctly', async () => {
    const pool = createPool(() => ({ value: 'test' }), 1);
    const item1 = await pool.get();
    const getPromise = pool.get();
    item1.unUse();
    const item2 = await getPromise;
    expect(() => item2.data()).toThrow('数据已被返还');
  });

  it('should throw an error when data is accessed after it has been returned', async () => {
    const pool = createPool(() => ({ value: 'test' }), 1);
    const item1 = await pool.get();
    item1.unUse();
    expect(() => item1.data()).toThrow('数据已被返还');
  });
});
