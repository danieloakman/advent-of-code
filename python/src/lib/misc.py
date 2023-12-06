import os
from functools import reduce


def file_input_path(year: int, day: int) -> str:
    return os.path.join(os.getcwd(), "../tmp", "{}-{}-input.txt".format(year, day))


def file_input(year: int, day: int) -> str:
    """Return the contents of the input file for the given year and day."""
    path = file_input_path(year, day)
    with open(path) as f:
        return f.read()


def file_input_lines(year: int, day: int) -> list:
    """Return the contents of the input file for the given year and day as a list of lines."""
    path = file_input_path(year, day)
    with open(path, "r") as f:
        while True:
            line = f.readline()
            if not line:
                break
            yield line.strip()


def txt(input: str) -> str:
    """Trims the leading whitespace from every line in the given string, and trims the start and end of the whole string."""
    # return reduce(lambda a, b: a + "\n" + b, map(lambda s: s.lstrip(), input.splitlines())).strip()
    return "\n".join(map(lambda s: s.lstrip(), input.splitlines())).strip()
