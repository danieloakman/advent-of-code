export type Nullish<T> = T | null | undefined;

export interface Solution {
  firstStar: () => Promise<Nullish<string | number>>;
  secondStar: () => Promise<Nullish<string | number>>;
}
