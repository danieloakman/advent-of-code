proc solve(): int =
  let f = open("../tmp/2015-1-input.txt")
  # Close the file object when you are done with it
  defer: f.close()

  while not f.endOfFile:
    let line = f.readLine()
    echo line

when isMainModule:
  discard solve()
