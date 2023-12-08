""" https://adventofcode.com/2023/day/1 """
from lib.misc import txt
from lib.puzzle_input import puzzle_input


def is_number(string: str) -> bool:
    """Is the given string a number?"""
    try:
        int(string)
        return True
    except ValueError:
        return False


def parse_line(string: str) -> int:
    """Parse one line from the expected input."""
    nums = list(filter(is_number, string))
    return int(nums[0] + nums[-1])


def first_star(text: str) -> int:
    """Solution to the 1st star of the day"""
    return sum(map(parse_line, text.splitlines()))


def second_star(_text: str) -> int:
    """Solution to the 2nd star of the day"""
    return 0


if __name__ == "__main__":
    assert (
        first_star(
            txt(
                """
                1abc2
                pqr3stu8vwx
                a1b2c3d4e5f
                treb7uchet"""
            )
        )
        == 142
    )
    print(first_star(puzzle_input(2023, 1)))
    # assert second_star(txt("""
    #   two1nine
    #   eightwothree
    #   abcone2threexyz
    #   xtwone3four
    #   4nineeightseven2
    #   zoneight234
    #   7pqrstsixteen
    # """)) == 281
    # print(second_star(puzzle_input(2023, 1)))
