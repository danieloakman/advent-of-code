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
