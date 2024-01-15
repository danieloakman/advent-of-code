package main

import (
	"danieloakman/aoc/lib"
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
	input := lib.GetInput(2015, 1)
	floor, firstBasement := solve(input)
	fmt.Printf("Floor: %d, First Basement: %d", floor, firstBasement)
}
