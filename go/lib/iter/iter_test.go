package iter

import (
	// "fmt"
	"danieloakman/aoc/lib"
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestMapFilterReduce(t *testing.T) {
	assert := assert.New(t)

	t.Run("TestMapFilterReduce", func(t *testing.T) {
		n := Range(10).Map(func(x int) int { return x * 2 }).FilterMap(func(n int) *int {
			if n%3 == 0 {
				return &n
			}
			return nil
		}).Reduce(0, lib.Sum)
		assert.Equal(n, 90)
	})
	// tests := []struct {
	// 	input string
	// 	want  int
	// }{
	// 	{"1", 1},
	// }
	// for _, test := range tests {
	// 	t.Run(fmt.Sprintf("TestMapFilterReduce(%s)", test.input), func(t *testing.T) {
	// 		// parsed := ParseInt(test.input)
	// 		// if parsed != test.want {
	// 		// 	t.Errorf("ParseInt(%s) = %d, want %d", test.input, parsed, test.want)
	// 		// }
	// 	})
	// }
}

func TestFlatMap(t *testing.T) {
	assert := assert.New(t)

	t.Run("TestFlatMap", func(t *testing.T) {
		it := FlatMapTo(Range(3), func(n int) Iterator[string] {
			return MapTo(FromSlice([]int{n - 1, n, n + 1}), func(n int) string {
				return fmt.Sprint(n)
			})
		})
		assert.Equal([]string{"-1", "0", "1", "0", "1", "2", "1", "2", "3"}, it.ToSlice())
	})
}
