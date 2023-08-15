export type HRTime = [seconds: number, nanoseconds: number];

export class Timer {
  protected start: HRTime = process.hrtime();

  /** Elapsed time in milliseconds */
  get ms(): number {
    const elapsed = process.hrtime(this.start);
    return elapsed[0] * 1e3 + elapsed[1] / 1e6;
  }

  /** Converts `ms` to an appropriate unit of time. Doesn't support less than 1 nanosecond. */
  static toElapsedStr(ms: number): `(elapsed ${number}${'s' | 'ms' | 'ns' | 'µs'})` {
    if (ms > 1e3) return `(elapsed ${ms / 1e3}s)`;
    if (ms > 1) return `(elapsed ${ms}ms)`;
    if (ms > 0.001) return `(elapsed ${ms * 1e3}µs)`;
    return `(elapsed ${ms * 1e6}ns)`;
  }


  /** Elapsed time formatted into a string. */
  elapsed(): `(elapsed ${number}${'s' | 'ms' | 'ns' | 'µs'})` {
    return Timer.toElapsedStr(this.ms);
  }

  reset() {
    this.start = process.hrtime();
  }
}

export default Timer;
