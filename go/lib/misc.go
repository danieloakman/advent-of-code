package lib

import (
	"strconv"
	"fmt"
)

// Parses a string into an int, panicking if it fails.
func ParseInt(s string) int {
	i, err := strconv.Atoi(s)
	if err != nil {
		panic(fmt.Sprint("Failed to parse int:", s, err))
	}
	return i
}

