from typing import Generator
import numpy as np
from lib.misc import assert_equal, txt, safe_int, string_dimensions
from lib.puzzle_input import puzzle_input


def parse_ndarray(text: str):
    arr = np.ndarray(shape=string_dimensions(text), dtype=int)
    for x, line in enumerate(text.splitlines()):
        for y, char in enumerate(line):
            n = safe_int(char)
            if n is not None:
                arr[x][y] = n
            elif char == ".":
                arr[x][y] = 10
            else:
                arr[x][y] = 11
    return arr


Point = tuple[int, int]


def neighbours(p: Point, arr: np.ndarray) -> Generator[tuple[Point, int], None, None]:
    for x in range(-1, 2):
        for y in range(-1, 2):
            if x == 0 and y == 0:
                continue
            n_x = p[0] + x
            n_y = p[1] + y
            if n_x < 0 or n_y < 0 or n_x >= arr.shape[0] or n_y >= arr.shape[1]:
                continue
            yield ((n_x, n_y), arr[n_x][n_y])


def first_star(text: str) -> int:
    """Solution to the 1st star of the day"""
    arr = parse_ndarray(text)

    part_nums: list[int] = []
    for x, row in enumerate(arr):
        last_part_num = ""
        is_part_num = False
        for y, n in enumerate(row):
            if n > 9:
                if is_part_num:
                    part_nums.append(int(last_part_num))
                    is_part_num = False
                last_part_num = ""
                continue
            last_part_num += str(n)
            if not is_part_num:
                for _p, n in neighbours((x, y), arr):
                    if n == 11:
                        is_part_num = True
                        break
        if is_part_num:
            part_nums.append(int(last_part_num))

    return sum(part_nums)


def second_star(text: str) -> int:
    """Solution to the 2nd star of the day"""
    _arr = parse_ndarray(text)

    # todo

    return 0


if __name__ == "__main__":
    example = txt(
        """
        467..114..
        ...*......
        ..35..633.
        ......#...
        617*......
        .....+.58.
        ..592.....
        ......755.
        ...$.*....
        .664.598.."""
    )

    assert_equal(first_star(example), 4361)
    print(first_star(puzzle_input(2023, 3)))
    assert_equal(second_star(example), 467835)
