package main

import (
	"danieloakman/aoc/lib"
	"fmt"
	"os"
	"path/filepath"
)

func main() {
	if len(os.Args) < 3 {
		println("Usage: create <year> <day>")
		os.Exit(1)
	}

	cwd := lib.Ok(os.Getwd())

	year := os.Args[1]
	day := os.Args[2]
	path := filepath.Join(cwd, year, day, "main.go")

	if lib.PathExists(path) {
		println("File already exists:", path)
		os.Exit(1)
	}

	// Create directory to the file:
	lib.MayPanic(os.MkdirAll(filepath.Join(cwd, year, day), os.ModePerm))

	fileStr := fmt.Sprintf(`package main
import "danieloakman/aoc/lib/solution"

// See https://adventofcode.com/%s/day/%s
func main() {
	solution.Solve(%s, %s, solution.Todo, solution.Todo)
}
`, year, day, year, day)

	lib.MayPanic(os.WriteFile(path, []byte(fileStr), 0777))
}
