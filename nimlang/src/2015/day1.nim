proc solve(): int =
  let f = open("../")
  # Close the file object when you are done with it
  defer: f.close()

  while f.endOfFile:
    let line = f.readLine()
    echo line
    

when isMainModule:
  discard solve()
