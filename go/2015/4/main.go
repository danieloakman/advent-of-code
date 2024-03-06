package main

import (
	"crypto/md5"
	"danieloakman/aoc/lib/iter"
	"danieloakman/aoc/lib/solution"
	"fmt"
	"strconv"
)

func hash(input string) string {
	h := md5.New()
	h.Write([]byte(input))
	return fmt.Sprintf("%x", h.Sum(nil))
}

func hasher(input string) iter.Iterator2[int, string] {
	return func(yield func(int, string) bool) {
		i := 0
		for {
			h := hash(input + strconv.Itoa(i))
			if !yield(i, h) {
				break
			}
			i++
		}
	}
}

func main() {
	solution.Solve(2015, 4, func(input string) string {
		hashes := hasher(input)
		for i, h := range hashes {
			// Check for 5 leading zeroes:
			if h[:5] == "00000" {
				return strconv.Itoa(i)
			}
		}
		panic("No hash found")
	}, func(input string) string {
		// Could be sped up by creating `hasher` once and then using it one after another in both stars.
		hashes := hasher(input)
		for i, h := range hashes {
			if h[:6] == "000000" {
				return strconv.Itoa(i)
			}
		}
		panic("No hash found")
	})
}
