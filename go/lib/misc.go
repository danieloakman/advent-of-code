package lib

import (
	"fmt"
	"strconv"
)

// Parses a string into an int, panicking if it fails.
func ParseInt(s string) int {
	i, err := strconv.Atoi(s)
	if err != nil {
		panic(fmt.Sprint("Failed to parse int:", s, err))
	}
	return i
}

// Generic function that takes a tuple and returns the value, else panics if `err != nil`.
func Ok[T any](value T, err error) T {
	if err != nil {
		panic(err)
	}
	return value
}
