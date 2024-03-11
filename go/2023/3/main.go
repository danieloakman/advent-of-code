package main

import (
	"danieloakman/aoc/lib/ndarray"
	"danieloakman/aoc/lib/solution"
)

func firstStar(input string) string {
	arr := ndarray.NewInt([]int{5, 5})
	println(arr.Get(4, 4))
	arr.Set(2, 0, 0)
	println(arr.Get(4, 4))
	println(arr.Values().ToSlice())
	return "TODO"
}

func main() {
	solution.Solve(2023, 3, firstStar, solution.Todo)
}
