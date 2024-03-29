package main

import (
	"danieloakman/aoc/lib/solution"
	"fmt"
)

func solve(input string) (int, int) {
	floor := 0
	firstBasement := -1
	charNum := 0

	for i := range input {
		char := string(input[i])
		charNum++
		if char == "(" {
			floor++
		} else if char == ")" {
			floor--
		}
		if floor == -1 && firstBasement == -1 {
			firstBasement = charNum
		}
	}
	return floor, firstBasement
}

func main() {
	solution.Solve(
		2015,
		1,
		func(input string) string {
			floor, _ := solve(input)
			return fmt.Sprint(floor)
		},
		func(input string) string {
			_, firstBasement := solve(input)
			return fmt.Sprint(firstBasement)
		},
	)
}
