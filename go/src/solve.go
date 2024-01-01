package main

import (
	"os"
	"strconv"
)

func parseInt(s string) int {
	i, err := strconv.Atoi(s)
	if err != nil {
		panic(err)
	}
	return i
}

type Solution struct {
	year int
	day int
	part1 func() string
	part2 func() string
}

type AOC struct {
	solutions []Solution
}

type YearDay struct {
	year int
	day int
}

func (aoc *AOC) add(solution Solution) {
	aoc.solutions = append(aoc.solutions, solution)
}

// Solve all solutions or for a specific year and day.
func (aoc *AOC) solve(yearDay *YearDay) {
	if yearDay == nil {
		for _, solution := range aoc.solutions {
			solution.part1()
			solution.part2()
		}
	} else {
		for _, solution := range aoc.solutions {
			if solution.year == yearDay.year && solution.day == yearDay.day {
				solution.part1()
				solution.part2()
				break
			}
		}
	}
}

var aoc = AOC{}

func main() {
	yearDay := YearDay{parseInt(os.Args[1]), parseInt(os.Args[2])}
	aoc.solve(&yearDay)
}
