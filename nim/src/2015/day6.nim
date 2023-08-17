from "../../lib/utils" import fileLines
import std/re
import std/strutils
from std/sequtils import map
import std/sugar

type Point = (int, int)

# proc mapInput(path: string): iterator(): (string, Point) =
iterator commands(path: string): (string, Point, Point) =
  let regex = re"^\D+"
  var matches: array[1, string]
  for line in fileLines(path):
    discard line.find(regex, matches)
    let cmd = matches[0]
    let r = line.replace(re(cmd), "").strip().split(" through ").map(s => s.split(",").map(parseInt))
    # let e = r[0]
    # r.delete(0)
    yield ("", (r[0][0], r[0][1]), (r[1][0], r[1][1]))

    # yield (cmd, r.shift(), r.shift())

when isMainModule:
  for v in commands("../tmp/2015-6-input.txt"):
    echo v