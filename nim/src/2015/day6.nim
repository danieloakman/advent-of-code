from "../../lib/utils" import fileLines

type Point = (int, int)

proc mapInput(path: string): iterator(): (string, Point) =
  for line in fileLines(path):
    let