import { toFixed } from './utils';

export type HRTime = [seconds: number, nanoseconds: number];

export class Timer {
  protected start: HRTime = process.hrtime();

  /** Elapsed time in milliseconds */
  get ms(): number {
    const elapsed = process.hrtime(this.start);
    return elapsed[0] * 1e3 + elapsed[1] / 1e6;
  }

  /** Converts `ms` to an appropriate unit of time. Doesn't support less than 1 nanosecond. */
  static toElapsedStr(ms: number): `(elapsed ${string}${'s' | 'ms' | 'ns' | 'µs'})` {
    if (ms > 1e3) return `(elapsed ${toFixed(ms / 1e3, 2)}s)`;
    if (ms > 1) return `(elapsed ${toFixed(ms, 2)}ms)`;
    if (ms > 0.001) return `(elapsed ${toFixed(ms * 1e3, 2)}µs)`;
    return `(elapsed ${toFixed(ms * 1e6, 2)}ns)`;
  }

  /** Elapsed time formatted into a string. */
  elapsed(): `(elapsed ${string}${'s' | 'ms' | 'ns' | 'µs'})` {
    return Timer.toElapsedStr(this.ms);
  }

  reset() {
    this.start = process.hrtime();
  }
}

export default Timer;

// // import.meta.vitest
// if (canTest()) {
//   describe('Timer', () => {
//     it('ms', async () => {
//       const timer = new Timer();
//       await sleep(1);
//       const ms = timer.ms;
//       expect(ms).toBeGreaterThan(0);
//       expect(ms).toBeLessThan(5);
//     });

//     it('elapsed', async () => {
//       expect(Timer.toElapsedStr(0.00000001)).toContain('1ns');
//       expect(Timer.toElapsedStr(0.000001)).toContain('1ns');
//       expect(Timer.toElapsedStr(0.00001)).toContain('10ns');
//       expect(Timer.toElapsedStr(0.0001)).toContain('100ns');
//       expect(Timer.toElapsedStr(0.01)).toContain('10µs');
//       expect(Timer.toElapsedStr(0.1)).toContain('100µs');
//       expect(Timer.toElapsedStr(1)).toContain('1000µs');
//       expect(Timer.toElapsedStr(2)).toContain('2ms');
//     });
//   });
// }
