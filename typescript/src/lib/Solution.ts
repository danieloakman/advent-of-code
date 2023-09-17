import { Nullish, main } from 'js-utils';
import Timer from './Timer';
import { downloadInput } from './downloadInput';

export interface SolutionMethod {
  (
    /** The current day's input string. */
    input: string,
  ): Promise<Nullish<string | number>> | Nullish<string | number>;
}

export type SolutionTest = [testName: string, test: () => void | Promise<void>];

export class Solution<FirstStar extends SolutionMethod, SecondStar extends SolutionMethod> {
  constructor(
    private readonly year: number,
    private readonly day: number,
    private readonly firstStar: FirstStar,
    private readonly secondStar: SecondStar,
    // TODO: this should be refactored to be a method instead that returns a pseudo test like `it` function that can be handled in years.test.ts
    readonly tests: SolutionTest[] = [],
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
    main(module, async () => this.solve());
  }
}

export default Solution;
