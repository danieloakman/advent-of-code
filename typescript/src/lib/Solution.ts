import { Nullish, main } from 'js-utils';
import Timer from './Timer';
import { downloadInput } from './downloadInput';

export interface SolutionMethod {
  (
    /** The current day's input string. */
    input: string,
  ): Promise<Nullish<string | number>> | Nullish<string | number>;
}

export type TestArgs = [testName: string, test: () => void | Promise<void>];

export interface SolutionTest {
  testName: string;
  test: () => void | Promise<void>;
  status: 'todo' | 'skip' | 'run';
}

export class Solution {
  readonly test: {
    (...args: TestArgs): Solution;
    skip: (...args: TestArgs) => Solution;
    todo: (...args: TestArgs) => Solution;
  } = Object.assign(
    (testName: string, test: () => void | Promise<void>) => {
      this.tests.push({
        testName,
        test,
        status: 'run',
      });
      return this;
    },
    {
      skip: (testName: string, test: () => void | Promise<void>) => {
        this.tests.push({
          testName,
          test,
          status: 'skip',
        });
        return this;
      },
      todo: (testName: string, test: () => void | Promise<void>) => {
        this.tests.push({
          testName,
          test,
          status: 'todo',
        });
        return this;
      },
    },
  );
  readonly tests: SolutionTest[] = [];

  constructor(
    private readonly year: number,
    private readonly day: number,
    private readonly firstStar: SolutionMethod,
    private readonly secondStar: SolutionMethod,
  ) {}

  /** Retrieves the solution's input, then runs `firstStar` and `secondStar` sequentially while timing their execution. */
  async solve() {
    const input = await downloadInput(this.year, this.day);

    const timer = new Timer();
    console.log('🎄 First star:', await this.firstStar(input), timer.elapsed());
    timer.reset();
    console.log('🎄 Second star:', await this.secondStar(input), timer.elapsed());
  }

  /** Internally calls `solve` wrapped in `main`. */
  async main(module: any) {
    await main(module, async () => this.solve());
  }
}

export default Solution;
