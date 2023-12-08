from typing import Generator
from .misc import join_norm, tmpdir


def puzzle_input_path(year: int, day: int) -> str:
    return join_norm(tmpdir(), f"{year}-{day}-input.txt")


def puzzle_input(year: int, day: int) -> str:
    """Return the contents of the input file for the given year and day."""
    file_path = puzzle_input_path(year, day)
    with open(file_path, "r", encoding="utf8") as f:
        return f.read()


def puzzle_input_lines(year: int, day: int) -> Generator[str, None, None]:
    """Return the contents of the input file for the given year and day as a list of lines."""
    file_path = puzzle_input_path(year, day)
    with open(file_path, "r", encoding="utf8") as f:
        while True:
            line = f.readline()
            if not line:
                break
            yield line.strip()
