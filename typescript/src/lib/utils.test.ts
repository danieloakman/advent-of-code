import { describe, it, expect } from 'vitest';
import { toFixed } from './utils';

describe('utils', () => {
  it('toFixed', async () => {
    expect(toFixed(1.00000, 2)).toBe('1');
  });
});