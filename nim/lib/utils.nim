from os import paramCount, paramStr
from std/strutils import contains

iterator fileLines*(path: string): string =
  let f = open(path)
  defer: f.close()
  while not f.endOfFile:
    yield f.readLine()

iterator countTo*(n: int): int =
  var i = 0
  while i <= n:
    yield i
    inc i

## Contanis all command line params:
iterator argv*(): string =
  for i in countTo(paramCount()):
    yield paramStr(i)

## Return true if an argument contains test.
proc canTest*(): bool =
  for arg in argv():
    if arg.contains "test":
      return true
  return false
