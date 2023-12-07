import numpy as np
from lib.misc import file_input, assert_equal, txt

    
def first_star(text: str) -> int:
    """Solution to the 1st star of the day"""
    arr = np.ndarray(shape=[200, 200], dtype=int)
    print(arr)
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
