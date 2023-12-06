from lib.misc import file_input, txt
import itertools


def is_number(s: str) -> bool:
    try:
        int(s)
        return True
    except ValueError:
        return False


def parse_line(s: str) -> int:
    nums = list(filter(is_number, s))
    return int(nums[0] + nums[-1])


def first_star(input: str) -> int:
    return sum(map(parse_line, input.splitlines()))
    # for line in file_input_lines(2023, 1):
    # print(line)


def second_star(input: str) -> int:
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
    print(first_star(file_input(2023, 1)))
    # assert second_star(txt("""
    #   two1nine
    #   eightwothree
    #   abcone2threexyz
    #   xtwone3four
    #   4nineeightseven2
    #   zoneight234
    #   7pqrstsixteen
    # """)) == 281
    # print(second_star(file_input(2023, 1)))
