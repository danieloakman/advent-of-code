export class Timer {
  protected start: [seconds: number, nanoseconds: number] = process.hrtime();

  /** Elapsed time in milliseconds */
  elapsed() {
    const elapsed = process.hrtime(this.start);
    return elapsed[0] * 1e3 + elapsed[1] / 1e6;
  }

  elapsedPretty(): `(elapsed ${number}${'s' | 'ms' | 'ns' | 'µs'})` {
    const ms = this.elapsed();
    if (ms > 1e3) return `(elapsed ${ms / 1e3}s)`;
    if (ms > 1) return `(elapsed ${ms}ms)`;
    if (ms > 0.001) return `(elapsed ${ms * 1e3}µs)`;
    return `(elapsed ${ms * 1e6}ns)`;
  }

  reset() {
    this.start = process.hrtime();
  }
}

export default Timer;
