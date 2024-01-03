package main

import (
	"os"
	"os/exec"
	"path/filepath"

	// "danieloakman/aoc/lib"
)

// Solve all solutions or for a specific year and day.
// func (aoc *AOC) solve(yearDay *YearDay) {
// 	if yearDay == nil {
// 		for _, solution := range aoc.solutions {
// 			solution.part1()
// 			solution.part2()
// 		}
// 	} else {
// 		for _, solution := range aoc.solutions {
// 			if solution.year == yearDay.year && solution.day == yearDay.day {
// 				solution.part1()
// 				solution.part2()
// 				break
// 			}
// 		}
// 	}
// }

// var aoc = AOC{}

func main() {
	// yearDay := YearDay{parseInt(os.Args[1]), parseInt(os.Args[2])}
	// aoc.solve(&yearDay)
	if len(os.Args) < 3 {
		println("Usage: solve <year> <day>")
		os.Exit(1)
	}

	// year := lib.ParseInt(os.Args[1])
	// day := lib.ParseInt(os.Args[2])
	cwd, _ := os.Getwd()
	path := filepath.Join(cwd, os.Args[1], os.Args[2], "main.go")

	println("Solving", path)
	// output, err := exec.Command("go", "run", path).Output()
	// if err != nil {
	// 	println("Error:", err.Error())
	// 	os.Exit(1)
	// }
	// println(string(output[:]))
	cmd := exec.Command("go", "run", path)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Run()
}
