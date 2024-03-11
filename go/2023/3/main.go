package main

import (
	"danieloakman/aoc/lib/ndarray"
	"danieloakman/aoc/lib/solution"
)

func firstStar(input string) string {
	arr := ndarray.NewInt([]int{5, 5})
	// println(arr.Get(4, 4))
	arr.Set(1, 1, 0)
	arr.Set(3, 3, 0)
	// println(arr.Get(4, 4))
	arr.Iter().FilterMap(func (pv ndarray.PointValue[int]) *ndarray.PointValue[int] {
		if pv.Value == 0 {
			return nil
		}
		return &pv
	}).Each(func (v ndarray.PointValue[int]) {
		println(v.Value)
	})
	return "TODO"
}

func main() {
	solution.Solve(2023, 3, firstStar, solution.Todo)
}
