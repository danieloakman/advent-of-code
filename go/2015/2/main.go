package main

import (
	"danieloakman/aoc/lib"
	"danieloakman/aoc/lib/iter"
	"strconv"
	"strings"
)

type Present struct {
	l int
	w int
	h int
}

func (p Present) surfaceArea() int {
	return 2*p.l*p.w + 2*p.w*p.h + 2*p.h*p.l
}

func newPresent(str string) Present {
	parts := strings.Split(str, "x")
	return Present{
		lib.ParseInt(parts[0]),
		lib.ParseInt(parts[1]),
		lib.ParseInt(parts[2]),
	}
}

func presents(input string) iter.Iterator[Present] {
	return iter.MapTo(iter.FromSlice(strings.Split(input, "\n")), newPresent)
}

func firstStar(input string) string {
	sum := iter.ReduceTo(presents(input), 0, func(acc int, p Present) int {
		return acc + p.surfaceArea()
	})
	return strconv.Itoa(sum)
}

func main() {
	input := lib.GetInput(2015, 2)
	println(firstStar(input))
}
