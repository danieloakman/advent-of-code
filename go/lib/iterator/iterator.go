package iterator

import (
	"iter"
)

// Convert a slice to an Iterator.
func FromSlice[T any](items []T) iter.Seq[T] {
	return func(yield func(T) bool) {
		for _, item := range items {
			if !yield(item) {
				return
			}
		}
	}
}

// Convert a slice to an Iterator, reversed.
func FromSliceR[T any](items []T) iter.Seq[T] {
	return func(yield func(T) bool) {
		for i := len(items)-1; i >= 0; i-- {
			if !yield(items[i]) {
				return
			}
		}
	}
}

func ToSlice[T any](seq iter.Seq[T]) []T {
	result := []T{}
	seq(func(item T) bool {
		result = append(result, item)
		return true
	})
	return result
}

func FromString(str string) iter.Seq[string] {
	return func(yield func(string) bool) {
		for _, c := range str {
			if !yield(string(c)) {
				return
			}
		}
	}
}

func FromStringR(str string) iter.Seq[string] {
	return func(yield func(string) bool) {
		for i := len(str)-1; i >= 0; i-- {
			if !yield(string(str[i])) {
				return
			}
		}
	}
}

func Enumerate[T any](seq iter.Seq[T]) iter.Seq2[int, T] {
	return func(yield func(int, T) bool) {
		i := 0
		seq(func(item T) bool {
			if !yield(i, item) {
				return false
			}
			i++
			return true
		})
	}
}

func Map[T any, U any](seq iter.Seq[T], f func(T) U) iter.Seq[U] {
	return func(yield func(U) bool) {
		seq(func(item T) bool {
			return yield(f(item))
		})
	}
}

func Filter[T any](seq iter.Seq[T], predicate func(T) bool) iter.Seq[T] {
	return func(yield func(T) bool) {
		seq(func(item T) bool {
			if predicate(item) {
				return yield(item)
			}
			return true
		})
	}
}

func Reduce[T any, U any](seq iter.Seq[T], initial U, f func(U, T) U) U {
	result := initial
	seq(func(item T) bool {
		result = f(result, item)
		return true
	})
	return result
}

func Take[T any](seq iter.Seq[T], n int) iter.Seq[T] {
	return func(yield func(T) bool) {
		i := 0
		seq(func(item T) bool {
			if i >= n {
				return false
			}
			i++
			return yield(item)
		})
	}
}

func Drop[T any](seq iter.Seq[T], n int) iter.Seq[T] {
	return func(yield func(T) bool) {
		i := 0
		seq(func(item T) bool {
			if i < n {
				i++
				return true
			}
			return yield(item)
		})
	}
}

func TakeWhile[T any](seq iter.Seq[T], predicate func(T) bool) iter.Seq[T] {
	return func(yield func(T) bool) {
		seq(func(item T) bool {
			if !predicate(item) {
				return false
			}
			return yield(item)
		})
	}
}

func Some[T any](seq iter.Seq[T], predicate func(T) bool) bool {
	next, _ := iter.Pull(seq)
	for {
		item, hasMore := next()
		if !hasMore {
			return false
		}
		if predicate(item) {
			return true
		}
	}
}

func Every[T any](seq iter.Seq[T], predicate func(T) bool) bool {
	next, _ := iter.Pull(seq)
	for {
		item, hasMore := next()
		if !hasMore {
			return true
		}
		if !predicate(item) {
			return false
		}
	}
}

func Find[T any](seq iter.Seq[T], predicate func(T) bool) *T {
	next, _ := iter.Pull(seq)
	for {
		item, hasMore := next()
		if !hasMore {
			return nil
		}
		if predicate(item) {
			return &item
		}
	}
}
