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
	return iter.Map(
		iter.FromSlice(strings.Split(input, "\n")),
		func(line *string) Present {
			return newPresent(*line)
		},
	)
	// result := []Present{}
	// for _, line := range strings.Split(input, "\n") {
	// 	result = append(result, newPresent(line))
	// }
	// return result
}

func firstStar(input string) string {
	sum := 0
	presents(input).Each(func(p *Present) {
		sum += p.surfaceArea()
	})
	return strconv.Itoa(sum)
}

func main() {
	input := lib.GetInput(2015, 2)
	println(firstStar(input))
}
