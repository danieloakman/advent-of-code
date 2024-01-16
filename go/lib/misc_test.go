package lib

import (
	"fmt"
	"testing"
)

func TestParseInt(t *testing.T) {
	tests := []struct {
		input string
		want  int
	}{
		{"1", 1},
		{"-1", -1},
		{"0", 0},
		{"123", 123},
		{"-123", -123},
	}
	for _, test := range tests {
		t.Run(fmt.Sprintf("ParseInt(%s)", test.input), func(t *testing.T) {
			parsed := ParseInt(test.input)
			if parsed != test.want {
				t.Errorf("ParseInt(%s) = %d, want %d", test.input, parsed, test.want)
			}
		})
	}
}
