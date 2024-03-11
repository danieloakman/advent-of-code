package main

import (
	"os"
	"os/exec"
	"path/filepath"

	"danieloakman/aoc/lib"
)

func main() {
	if len(os.Args) < 3 {
		println("Usage: solve <year> <day>")
		os.Exit(1)
	}

	year := os.Args[1]
	day := os.Args[2]
	path := filepath.Join(lib.Ok(os.Getwd()), year, day, "main.go")

	println("Solving", path)
	cmd := exec.Command("go", "run", path)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Run()
}
