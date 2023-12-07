from os import path, getcwd
from typing import Generator


def file_input_path(year: int, day: int) -> str:
    return path.join(getcwd(), "../tmp", f"{year}-{day}-input.txt")


def file_input(year: int, day: int) -> str:
    """Return the contents of the input file for the given year and day."""
    file_path = file_input_path(year, day)
    with open(file_path, "r", encoding="utf8") as f:
        return f.read()


def file_input_lines(year: int, day: int) -> Generator[str, None, None]:
    """Return the contents of the input file for the given year and day as a list of lines."""
    file_path = file_input_path(year, day)
    with open(file_path, "r", encoding="utf8") as f:
        while True:
            line = f.readline()
            if not line:
                break
            yield line.strip()


def txt(string: str) -> str:
    """Trims the leading whitespace from every line in the given string, and trims the start and end of the whole string."""
    # return reduce(lambda a, b: a + "\n" + b, map(lambda s: s.lstrip(), input.splitlines())).strip()
    return "\n".join(map(lambda s: s.lstrip(), string.splitlines())).strip()
