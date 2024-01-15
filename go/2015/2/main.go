package main

import (
	"danieloakman/aoc/lib"
	"strings"
)

type Present struct {
	l int
	w int
	h int
}

func presents(input string) []Present {
	result := []Present{}
	for _, line := range strings.Split(input, "\n") {
		// p := Present{}
		// lib.Extract(line, `(\d+)x(\d+)x(\d+)`, &p.l, &p.w, &p.h)
		// result = append(result, p)
	}
	return result
}

func main() {
	input := lib.GetInput(2015, 2)

}