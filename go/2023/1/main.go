package main

import (
	"danieloakman/aoc/lib"
	"fmt"
	"strconv"
	"strings"
)

func isNumber(str string) bool {
	_, err := strconv.Atoi(str)
	return err == nil
}

func parseLine(str string) int {
	first := ""
	last := ""
	for i := range str {
		char := string(str[i])
		if isNumber(char) {
			if first == "" {
				first = char
				last = char
			} else {
				last = char
			}
		}
	}
	return lib.Ok(strconv.Atoi(first + last))
}

func FirstStar(input string) string {
	sum := 0
	lines := strings.Split(input, "\n")
	for i := range lines {
		sum += parseLine(lines[i])
	}
	return fmt.Sprint(sum)
}

func main() {
	println(FirstStar(lib.GetInput(2023, 1)))
}
