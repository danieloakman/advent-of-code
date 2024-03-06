import { Nullish, isNullish, main } from 'js-utils';
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
    /** Adds a test for any examples or unit tests for this solution. */
    (...args: TestArgs): Solution;
    /** Skips this test. */
    skip: (...args: TestArgs) => Solution;
    /** Marks this test as a TODO item. So if this starts passing, this test will fail until the todo is removed. */
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

  private star1: Nullish<SolutionMethod> = null;
  private star2: Nullish<SolutionMethod> = null;

  constructor(
    private readonly year: number,
    private readonly day: number,
  ) {}

  /** Retrieves the solution's input, then runs `firstStar` and `secondStar` sequentially while timing their execution. */
  async solve() {
    const input = await downloadInput(this.year, this.day);

    const timer = new Timer();
    console.log('🎄 First star:', await this.star1?.(input), timer.elapsed());
    timer.reset();
    console.log('🎄 Second star:', await this.star2?.(input), timer.elapsed());
  }

  /** Internally calls `solve` wrapped in `main`. */
  main(module: any) {
    main(module, async () => this.solve());
    return this;
  }

  /** Set the solution method for the first star. */
  firstStar(fn: SolutionMethod) {
    if (!isNullish(this.star1)) throw new Error('First star already set');
    this.star1 = fn;
    return this;
  }

  /** Set the solution method for the second star. */
  secondStar(fn: SolutionMethod) {
    if (!isNullish(this.star2)) throw new Error('Second star already set');
    this.star2 = fn;
    return this;
  }
}

export default Solution;
