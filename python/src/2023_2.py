""" https://adventofcode.com/2023/day/2 """
import re
from dataclasses import dataclass
from lib.misc import file_input, txt

Pick = tuple[int, int, int]

int_regex = re.compile(r"(\d+)")


def parse_first_int(string: str) -> int:
    """Returns the first integer in a string."""
    m = int_regex.search(string)
    if m is None:
        return 0
    return int(m.group(1))


@dataclass
class Game:
    """Defines a game with its id and picks."""

    id: str
    picks: list[Pick]


def parse_pick(string: str) -> Pick:
    pick: Pick = (0, 0, 0)
    for _p in string.split(","):
        # TODO
        pass
        # [color, count] = p.split(" ")
        # pick[color] = count
    return pick


def parse_game(line: str) -> Game:
    [game, rest] = line.split(":")
    print(game, rest)
    return Game(game, [])
    # tODO
    # return Game(parse_first_int(game), map(), rest.strip().split(";")))


def first_star(string: str) -> int:
    _games = map(parse_game, string.splitlines())
    return 0


if __name__ == "__main__":
    assert (
        first_star(
            txt(
                """
            Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
            Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
            Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
            Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
            Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green"""
            )
        )
        == 71
    )  # todo fix assert number
    print(first_star(file_input(2023, 2)))
