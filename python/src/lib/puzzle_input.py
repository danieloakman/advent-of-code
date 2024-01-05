from typing import Generator
import sys
from os import path
import urllib
import certifi
from .misc import join_norm, tmpdir, once


@once
def session_cookie() -> str:
    """Returns the session cookie for the current user."""
    try:
        with open(join_norm(tmpdir(), "sessionCookie.txt"), "r", encoding="utf8") as f:
            return f.read().strip()
    except FileNotFoundError:
        print("Please create a file named sessionCookie.txt in the tmp directory with your session cookie.")
        sys.exit(1)


def __download_puzzle_input(year: int, day: int) -> bytes:
    http = urllib.PoolManager(
        cert_reqs="CERT_REQUIRED",
        ca_certs=certifi.where(),
    )
    url = f"https://adventofcode.com/{year}/day/{day}/input"
    r = http.request("GET", url, headers={"Cookie": f"session={session_cookie()}"})
    return r.data


def puzzle_input_path(year: int, day: int) -> str:
    return join_norm(tmpdir(), f"{year}-{day}-input.txt")


def puzzle_input(year: int, day: int) -> str:
    """Return the contents of the input file for the given year and day."""
    file_path = puzzle_input_path(year, day)

    if not path.exists(file_path):
        b = __download_puzzle_input(year, day)
        with open(file_path, "wb") as f:
            f.write(b)
            return b.decode("utf8")
    with open(file_path, "r", encoding="utf8") as f:
        return f.read()


def puzzle_input_lines(year: int, day: int) -> Generator[str, None, None]:
    """Return the contents of the input file for the given year and day as a list of lines."""
    file_path = puzzle_input_path(year, day)

    if not path.exists(file_path):
        b = __download_puzzle_input(year, day)
        with open(file_path, "wb") as f:
            f.write(b)

    with open(file_path, "r", encoding="utf8") as f:
        while True:
            line = f.readline()
            if not line:
                break
            yield line.strip()
