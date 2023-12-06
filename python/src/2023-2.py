import re
from lib.misc import file_input, txt
from dataclasses import dataclass
from functools import reduce

Pick = tuple[int, int, int]

int_regex = re.compile(r"(\d+)")


def parse_first_int(input: str) -> int:
    return int(int_regex.search(input).group(1))


@dataclass
class Game:
    id: str
    picks: list[Pick]


def parse_pick(input: str) -> Pick:
    pick: Pick = tuple(0, 0, 0)
    for p in input.split(","):
        # TODO
        pass
        # [color, count] = p.split(" ")
        # pick[color] = count
    return pick


def parse_game(line: str) -> Game:
    [game, rest] = line.split(":")
    print(game, rest)

    # tODO
    # return Game(parse_first_int(game), map(), rest.strip().split(";")))


def first_star(input: str) -> int:
    return sum(map(parse_game, input.splitlines()))


if __name__ == "__main__":
    assert first_star(
        txt(
            """
            Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
            Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
            Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
            Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
            Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green"""
        )
    ) == 71 # todo fix assert number
    print(first_star(file_input(2023, 2)))
