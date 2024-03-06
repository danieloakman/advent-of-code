package solution

import (
	"danieloakman/aoc/lib"
	"fmt"
	"time"
)

type SolutionMethod func(string) string

func Todo(input string) string {
	return "TODO"
}

// type Solution struct {
// 	Year       int
// 	Day        int
// 	FirstStar  func(string) string
// 	SecondStar func(string) string
// }

func Solve(year int, day int, firstStar SolutionMethod, secondStar SolutionMethod) {
	input := lib.GetInput(year, day)

	start := time.Now()
	result := firstStar(input)
	elapsed := time.Since(start)
	if result == "TODO" {
		println("🎄 First star not implemented yet")
	} else {
		println(fmt.Sprintf("🎄 First star: %s (elapsed %s)", result, elapsed))
	}

	start = time.Now()
	result = secondStar(input)
	elapsed = time.Since(start)
	if result == "TODO" {
		println("🎄 Second star not implemented yet")
	} else {
		println(fmt.Sprintf("🎄 Second star: %s (elapsed %s)", result, elapsed))
	}
}
