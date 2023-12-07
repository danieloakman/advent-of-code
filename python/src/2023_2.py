""" https://adventofcode.com/2023/day/2 """
from dataclasses import dataclass
from lib.misc import file_input, txt, parse_first_int

Pick = tuple[int, int, int]


@dataclass
class Game:
    """Defines a game with its id and picks."""

    id: int
    picks: list[Pick]


def parse_pick(string: str) -> Pick:
    red = 0
    green = 0
    blue = 0
    for p in string.split(","):
        (count, color) = p.strip().split(" ")
        match color:
            case "red":
                red = int(count)
            case "green":
                green = int(count)
            case "blue":
                blue = int(count)
    return (red, green, blue)


def parse_game(line: str) -> Game:
    (game, rest) = line.split(":")
    picks = map(parse_pick, rest.split(";"))
    return Game(parse_first_int(game), list(picks))


def is_possible_game(game: Game, assertion: Pick) -> bool:
    for pick in game.picks:
        for i in range(3):
            if pick[i] > assertion[i]:
                return False
    return True


def first_star(string: str) -> int:
    games = map(parse_game, string.splitlines())
    possible_games = filter(lambda g: is_possible_game(g, (12, 13, 14)), games)
    return sum(map(lambda g: g.id, possible_games))


def min_possible_pick(game: Game) -> Pick:
    result = [0, 0, 0]
    for pick in game.picks:
        for i in range(3):
            if pick[i] > result[i]:
                result[i] = pick[i]
    return tuple(result)


def second_star(string: str) -> int:
    return sum(map(lambda x: x[0] * x[1] * x[2], map(min_possible_pick, map(parse_game, string.splitlines()))))


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
        == 8
    )
    print(first_star(file_input(2023, 2)))

    assert (
        (
            second_star(
                txt(
                    """
        Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
        Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
        Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
        Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
        Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green"""
                )
            )
        )
        == 2286
    )
    print(second_star(file_input(2023, 2)))
