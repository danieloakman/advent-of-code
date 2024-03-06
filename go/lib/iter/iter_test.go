package iter

import (
	// "fmt"
	"danieloakman/aoc/lib"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestMap(t *testing.T) {
	assert := assert.New(t)

	t.Run("TestMap", func(t *testing.T) {
		n := Range(0, 10, 1).Map(func(x int) int { return x * 2 }).Reduce(0, lib.Sum)
		assert.Equal(n, 90)
	})
	// tests := []struct {
	// 	input string
	// 	want  int
	// }{
	// 	{"1", 1},
	// }
	// for _, test := range tests {
	// 	t.Run(fmt.Sprintf("TestMap(%s)", test.input), func(t *testing.T) {
	// 		// parsed := ParseInt(test.input)
	// 		// if parsed != test.want {
	// 		// 	t.Errorf("ParseInt(%s) = %d, want %d", test.input, parsed, test.want)
	// 		// }
	// 	})
	// }
}
