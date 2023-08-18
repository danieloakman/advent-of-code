from os import execShellCmd, commandLineParams
from "../lib/utils" import argv, canTest

when isMainModule:
  echo canTest()
  echo "cmd args"
  for v in commandLineParams():
    echo v

  for v in argv():
    echo v