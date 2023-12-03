// @see https://adventofcode.com/2023/day/2/input
import { Solution, add, assert, equal, newLine, raise, safeParseInt } from '@lib';
import { iter } from 'iteragain-es';

const COLOURS = ['red', 'blue', 'green'] as const;
type Colour = typeof COLOURS[number];

type Pick = Record<Colour, number>;

interface Game {
  id: number;
  picks: Partial<Pick>[];
}


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
          .reduce((p, s) => {
            const [number, colour] = s.trim().split(' ');
            p[colour as Colour] = safeParseInt(number) ?? raise(`Could not parse int from "${number}"`);
            return p;
          }, {} as Partial<Pick>),
      ),
  };
}

function isGamePossible(game: Game, assertion: Pick): boolean {
  for (const pick of game.picks) {
    for (const colour in pick) {
      if ((pick[colour as Colour] ?? raise(`Could find ${colour} in ${pick}`)) > assertion[colour as Colour]) {
        return false;
      }
    }
  }
  return true;
}

function firstStar(input: string, assertion: Pick) {
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
