package main

import (
	"danieloakman/aoc/lib/iter"
	"danieloakman/aoc/lib"
	"strconv"
)

func firstStar(input string) int {
	// lines := strings.Split(input, "\n")
	num := 0
	if input[len(input)-1] == input[0] {
		num = lib.Ok(strconv.Atoi(string(input[0])))
	}
	for a, b := range iter.Pairwise(iter.FromString(input)) {
		if a == b {
			num += lib.Ok(strconv.Atoi(string(a)))
		}
	}
	return num
}

func main() {
	input := lib.GetInput(2017, 1)
	println("firstLine", firstStar(input))
}
