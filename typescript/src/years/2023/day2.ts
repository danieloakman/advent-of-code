// @see https://adventofcode.com/2023/day/2/input
import { Solution, add, assert, equal, newLine, raise, safeParseInt } from '@lib';
import { iter } from 'iteragain-es';

type Colour = 'red' | 'blue' | 'green';

interface Pick {
  colour: Colour;
  number: number;
}

interface Game {
  id: number;
  picks: Pick[][];
}

type ColourNums = Record<Colour, number>;

function parseGame(input: string): Game {
  const [game, rest] = input.split(':');
  return {
    id: safeParseInt(game.match(/\d+/)?.[0] ?? 'nan') ?? raise('Could not parse game id'),
    picks: rest
      .trim()
      .split(';')
      .map(pick =>
        pick
          .trim()
          .split(',')
          .map(s => {
            const [number, colour] = s.trim().split(' ');
            return {
              colour: colour as Colour,
              number: safeParseInt(number) ?? raise(`Could not parse int from "${number}"`),
            };
          }),
      ),
  };
}

function isGamePossible(game: Game, assertion: ColourNums): boolean {
  const totals: ColourNums = game.picks.reduce(
    (t, pick) => {
      pick.forEach(({ colour, number }) => (t[colour] += number));
      return t;
    },
    { red: 0, green: 0, blue: 0 } as ColourNums,
  );
  return Object.entries(assertion).every(([colour, number]) => totals[colour as Colour] <= number);
}

function firstStar(input: string, assertion: ColourNums) {
  return iter(input.split(newLine))
    .filterMap(line => {
      const game = parseGame(line.trim());
      return isGamePossible(game, assertion) ? game.id : null;
    })
    .reduce(add);
}

export const solution = new Solution(2023, 2)
  .firstStar(async input => firstStar(input, { red: 12, green: 13, blue: 14 }))
  .secondStar(async input => null)
  .test('example', async () => {
    assert(
      isGamePossible(parseGame('Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green'), {
        red: 12,
        green: 13,
        blue: 14,
      }),
    );
    equal(
      firstStar(
        `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
    Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
    Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
    Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
    Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        { red: 12, green: 13, blue: 14 },
      ),
      8,
    );
  })
  .main(import.meta.path);
