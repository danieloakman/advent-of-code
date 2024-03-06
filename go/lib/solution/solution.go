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
	fmt.Printf("🎄 First star: %s, elapsed %dns\n", result, elapsed)
	start = time.Now()
	result = solution.SecondStar(input)
	elapsed = time.Since(start)
	fmt.Printf("🎄 Second star: %s, elapsed %dns\n", result, elapsed)
}
