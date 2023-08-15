import { describe, it, expect } from 'vitest';
import { sleep, Timer } from './';

describe('Timer', () => {
  it('ms', async () => {
    const timer = new Timer();
    await sleep(1);
    const ms = timer.ms;
    expect(ms).toBeGreaterThan(0);
    expect(ms).toBeLessThan(5);
  });

  it('elapsed', async () => {
    expect(Timer.toElapsedStr(0.00000001)).toContain('1ns');
    expect(Timer.toElapsedStr(0.000001)).toContain('1ns');
    expect(Timer.toElapsedStr(0.00001)).toContain('10ns');
    expect(Timer.toElapsedStr(0.0001)).toContain('100ns');
    expect(Timer.toElapsedStr(0.01)).toContain('10µs');
    expect(Timer.toElapsedStr(0.1)).toContain('100µs');
    expect(Timer.toElapsedStr(1)).toContain('1000µs');
    expect(Timer.toElapsedStr(2)).toContain('2ms');
  });
});