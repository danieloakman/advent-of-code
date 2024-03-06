package solution

import (
	"danieloakman/aoc/lib"
	"fmt"
	"time"
)

type Solution struct {
	Year       int
	Day        int
	FirstStar  func(string) string
	SecondStar func(string) string
}

func (solution Solution) Solve() {
	input := lib.GetInput(solution.Year, solution.Day)
	start := time.Now()
	result := solution.FirstStar(input)
	elapsed := time.Since(start)
	println(fmt.Sprintf("🎄 First star: %s, elapsed %s", result, elapsed))
	start = time.Now()
	result = solution.SecondStar(input)
	elapsed = time.Since(start)
	println(fmt.Sprintf("🎄 Second star: %s, elapsed %s", result, elapsed))
}
