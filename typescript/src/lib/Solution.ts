import { Nullish } from './types';
import Timer from './Timer';
import { main } from './utils';
import { downloadInput } from './downloadInput';

export interface SolutionMethod {
  (input: string): Promise<Nullish<string | number>>;
}

export class Solution<FirstStar extends SolutionMethod, SecondStar extends SolutionMethod> {
  constructor(
    private readonly year: number,
    private readonly day: number,
    private readonly firstStar: FirstStar,
    private readonly secondStar: SecondStar,
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
