iterator fileLines*(path: string): string =
  let f = open(path)
  defer: f.close()
  while not f.endOfFile:
    yield f.readLine()
