from os import path, getcwd, mkdir
from typing import Generator, Union
import re
import json
from hashlib import md5
from time import perf_counter
from re import findall


def file_input_path(year: int, day: int) -> str:
    return join_norm(tmpdir(), f"{year}-{day}-input.txt")


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


int_regex = re.compile(r"(\d+)")


def parse_first_int(string: str, default: int | None = None) -> int:
    """Returns the first `int` in a `str`."""
    m = int_regex.search(string)
    if m is None:
        if default is not None:
            return default
        raise ValueError(f"Could not find an integer in {string}")
    return int(m.group(1))


def safe_int(string: str) -> int | None:
    """Parses a string into an `int`, or returns `None` if it fails."""
    try:
        return int(string)
    except ValueError:
        return None


def once(func):
    """Decorator to ensure a function is only called once and the return value is stored for
    subsequent calls.
    """

    def wrapper(*args, **kwargs):
        if wrapper.called is False:
            wrapper.called = True
            wrapper.value = func(*args, **kwargs)
        return wrapper.value

    wrapper.value = None
    wrapper.called = False
    return wrapper


def time_func(func):
    """Decorator to time the execution of a function."""

    def wrapper(*args, **kwargs):
        start = perf_counter()
        result = func(*args, **kwargs)
        print(func.__name__, "took", perf_counter() - start, "seconds")
        return result

    return wrapper


def log_func(func):
    """Decorator to log the execution of a function."""

    def wrapper(*args, **kwargs):
        print("%s(%s, %s)", func.__name__, args, kwargs)
        return func(*args, **kwargs)

    return wrapper


def safe_call(func, *args, **kwargs):
    """Safely call a function and return the result, or None if an exception is raised."""
    try:
        return func(*args, **kwargs)
    except Exception:  # pylint: disable=broad-except
        return None


@once
def tmpdir():
    """Returns the path to the temporary directory."""
    result_dir = path.abspath(join_norm(__file__, "../../../../tmp"))
    if not path.exists(result_dir):
        mkdir(result_dir)
    return result_dir


def join_norm(*paths) -> str:
    """Join paths and normalise the result. Just like nodejs's path.join function."""
    return path.normpath(path.join(*paths))  # type: ignore


def isiterable(obj):
    """Test whether an object is iterable."""
    try:
        _ = (e for e in obj)
        return True
    except Exception:  # pylint: disable=broad-except
        return False


def round_to_nearest(number: float, nearest: float):
    """Round a number to the nearest multiple of another number."""
    return round(number / nearest) * nearest


def hash_str(string: Union[str, bytes]) -> str:
    """Hash a string."""
    hashed = md5(string.encode("utf-8") if isinstance(string, str) else string)
    return hashed.hexdigest()


def hash_file(file_path: str):
    """Returns the hash of a file."""
    with open(file_path, "rb") as file:
        hashed = md5(file.read())
    return hashed.hexdigest()


def hash_dict(obj: dict):
    """Returns the hash of a JSON serializable dictionary."""
    encoded_string = json.dumps(obj, sort_keys=True, default=repr).encode("utf-8")
    return hash_str(encoded_string)


def parse_num_list(arg: Union[str, list[int]]) -> Union[range, list[int], None]:
    """Parse a string or list of integers into a range or list of integers."""
    if isinstance(arg, str):
        if "range" in arg.lower():
            params = findall(r"\d+", arg)
            return range(int(params[0]), int(params[1]), int(params[2]))
        return None
    return arg


def assert_equal(a, b):
    """Assert that two values are equal."""
    assert a == b, f"{a} != {b}"
