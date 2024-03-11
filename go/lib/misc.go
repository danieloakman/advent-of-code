package lib

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"slices"
	"strconv"
	"strings"
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

// Panics if `err != nil`.
func MayPanic(err error) {
	if err != nil {
		panic(err)
	}
}

func Tmpdir() string {
	_, filename, _, runtimeErr := runtime.Caller(0)
	if !runtimeErr {
		panic("runtime.Caller(0) panicked")
	}
	path := filepath.Join(filename, "../../../tmp")
	MayPanic(os.MkdirAll(path, 0777))
	return path
}

func SessionCookie() string {
	path := filepath.Join(Tmpdir(), "sessionCookie.txt")
	bytes := Ok(os.ReadFile(path))
	return strings.TrimSpace(string(bytes))
}

func downloadInput(year int, day int) []byte {
	url := fmt.Sprintf("http://adventofcode.com/%d/day/%d/input", year, day)
	req := Ok(http.NewRequest("GET", url, nil))

	req.AddCookie(&http.Cookie{
		Name: "session",
		Value: SessionCookie(),
	})
	req.Header.Set("User-Agent", "doakman94@gmail.com")

	resp := Ok(http.DefaultClient.Do(req))
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		panic(errors.New(url +
			"\nresp.StatusCode: " + strconv.Itoa(resp.StatusCode)))
	}

	return Ok(io.ReadAll(resp.Body))
}

func GetInput(year int, day int) string {
	path := filepath.Join(Tmpdir(), fmt.Sprintf("%d-%d-input.txt", year, day))
	if _, err := os.Stat(path); os.IsNotExist(err) {
		bytes := downloadInput(year, day)
		err = os.WriteFile(path, bytes, 0777)
		if err != nil {
			panic(err)
		}
		return strings.TrimSpace(string(bytes))
	}
	return string(Ok(os.ReadFile(path)))
}

func Sum[T string | int | float32 | float64](a T, b T) T {
	return a + b
}

// Returns whatever value is passed to it, `T => T`.
func Identity[T any](value T) T {
	return value
}

// Returns a function that always returns the same value.
func Constant[T any](value T) func() T {
	return func() T {
		return value
	}
}

// Returns -1 if n < 0, 1 if n > 0, and 0 if n == 0.
func Sign(n int) int {
	if n < 0 {
		return -1
	}
	if n > 0 {
		return 1
	}
	return 0
}
