package lib

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
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
	url := fmt.Sprintf("https://www.adventofcode.com/%d/day/%d/input", year, day)
	req := Ok(http.NewRequest("GET", url, nil))

	req.AddCookie(&http.Cookie{Name: "session", Value: SessionCookie(), Path: "/", MaxAge: 86400})
	req.Header.Set("User-Agent", "doakman94@gmail.com")
	req.Header.Set("Cookie", "session="+SessionCookie()) // TODO: still doesn't work, still get 400 Bad Request

	client := &http.Client{}
	resp := Ok(client.Do(req))
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
		return string(bytes)
	}
	return string(Ok(os.ReadFile(path)))
}

func Sum[T int | string](a T, b T) T {
	return a + b
}

func Identity[T any](value T) T {
	return value
}

func Constant[T any](value T) func() T {
	return func() T {
		return value
	}
}
