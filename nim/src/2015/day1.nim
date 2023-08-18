from "../../lib/utils" import fileLines

proc solve(): (int, int) =
  var
    floor = 0
    firstBasement = -1
    charNum = 0

  for line in fileLines("../tmp/2015-1-input.txt"):
    for char in line:
      charNum += 1
      if char == '(': floor += 1
      elif char == ')': floor -= 1
      if floor == -1 and firstBasement == -1:
        firstBasement = charNum

  return (floor, firstBasement)

when isMainModule:
  echo solve()
