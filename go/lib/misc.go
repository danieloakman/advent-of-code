package lib

import (
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
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

func Tmpdir() string {
	cwd := Ok(os.Getwd())
	path := filepath.Join(cwd, "../tmp")
	err := os.MkdirAll(path, 0777)
	if err != nil {
		panic(err)
	}
	return path
}

func SessionCookie() string {
	path := filepath.Join(Tmpdir(), "sessionCookie.txt")
	bytes := Ok(os.ReadFile(path))
	return string(bytes)
}

func download_input(year int, day int) []byte {
	url := fmt.Sprintf("https://www.adventofcode.com/%d/day/%d/input", year, day)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		panic(err)
	}

	req.AddCookie(&http.Cookie{Name: "session", Value: SessionCookie()})

	client := &http.Client{}
	resp, err := client.Do(req) // TODO: throws 400 Bad Request for some reason
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		err = errors.New(url +
			"\nresp.StatusCode: " + strconv.Itoa(resp.StatusCode))
		panic(err)
	}

	return Ok(ioutil.ReadAll(resp.Body))
}

func Get_Input(year int, day int) string {
	path := filepath.Join(Tmpdir(), fmt.Sprintf("%d-%d-input.txt", year, day))
	if _, err := os.Stat(path); os.IsNotExist(err) {
		bytes := download_input(year, day)
		err = os.WriteFile(path, bytes, 0777)
		if err != nil {
			panic(err)
		}
		return string(bytes)
	}
	return string(Ok(os.ReadFile(path)))
}
