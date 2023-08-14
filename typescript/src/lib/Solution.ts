import { Nullish } from './types';
import Timer from './Timer';

export interface SolutionMethod {
  (): Promise<Nullish<string | number>>;
}

export class Solution<FirstStar extends SolutionMethod, SecondStar extends SolutionMethod> {
  constructor(
    private readonly firstStar: FirstStar,
    private readonly secondStar: SecondStar,
  ) {}

  async solve() {
    const timer = new Timer();

    console.log('First star:', await this.firstStar(), `(elapsed ${timer.elapsed()}ms)`);

    timer.reset();

    console.log('Second star:', await this.secondStar(), `(elapsed ${timer.elapsed()}ms)`);
  }
}

export default Solution;
