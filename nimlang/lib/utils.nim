from os import paramCount, paramStr

iterator fileLines*(path: string): string =
  let f = open(path)
  defer: f.close()
  while not f.endOfFile:
    yield f.readLine()

# proc countTo*(n: int): iterator(): int =
iterator countTo*(n: int): int =
    var i = 0
    while i <= n:
      yield i
      inc i

proc canTest(): bool =
  # return true if an argument contains test:
  let c = countTo(5)
  return false
  # for i in c:
    # if paramStr(i).contains("test"):
      # return true
  # for arg in paramStr():
  #   if arg.contains "test":
  #     return true