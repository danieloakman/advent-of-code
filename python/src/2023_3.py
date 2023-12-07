import numpy as np
from lib.misc import file_input, assert_equal, txt, safe_int

def parse_ndarray(text: str):
    arr = np.ndarray(shape=[200, 200], dtype=int)
    for x, line in enumerate(text.splitlines()):
        for y, char in enumerate(line):
            n = safe_int(char)
            if n is not None:
                arr[x][y] = n
            elif char is ".":
                arr[x][y] = 10
            else:
                arr[x][y] = 11
    return arr
    
def first_star(text: str) -> int:
    """Solution to the 1st star of the day"""
    arr = parse_ndarray(text)
    print(arr)
    # for i, line in enumerate(text.splitlines()):
    #     for j, char in enumerate(line):
    #         arr[i][j] = 1 if char == "#" else 0
    return 0


if __name__ == "__main__":
    assert_equal(
        first_star(
            txt(
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
        ),
        4361,
    )
