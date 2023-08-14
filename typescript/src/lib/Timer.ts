export class Timer {
  protected start = process.hrtime();

  /** Elapsed time in milliseconds */
  elapsed() {
    const elapsed = process.hrtime(this.start);
    return elapsed[0] * 1000 + elapsed[1] / 1000000;
  }

  reset() {
    this.start = process.hrtime();
  }
}

export default Timer;
