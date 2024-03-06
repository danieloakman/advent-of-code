package iter_old

import (
	"testing"
	"reflect"
)

func TestFromSlice(t *testing.T) {
	iter := FromSlice([]int{1, 2, 3})
	if *iter.Next() != 1 {
		t.Errorf("expected 1")
	}
	if !reflect.DeepEqual(iter.ToSlice(), []int{2, 3}) {
		t.Errorf("expected [2, 3]")
	}
	if _, done := iter(); !done {
		t.Errorf("expected done")
	}
}