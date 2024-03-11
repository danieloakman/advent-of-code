package main

import (
	"danieloakman/aoc/lib"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func main() {
	if len(os.Args) < 3 {
		println("Usage: create <year> <day>")
		os.Exit(1)
	}

	year := os.Args[1]
	day := os.Args[2]
	path := filepath.Join(lib.Ok(os.Getwd()), year, day, "main.go")

	// Safely check if the file already exists:
	if _, err := os.Stat(path); !os.IsNotExist(err) {
		println("File already exists:", path)
		os.Exit(1)
	}

	fileStr := strings.TrimSpace(fmt.Sprintf(`
package main

import "danieloakman/aoc/lib/solution"

func main() {
	solution.Solve(%s, %s, solution.Todo, solution.Todo)
}
	`, year, day))

	// Write the file:
	lib.MayPanic(os.WriteFile(path, []byte(fileStr), 0777))
}
