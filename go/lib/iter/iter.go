package iter

import (
	"iter"
)

// Redefined `Seq` so we can define our own methods on it, but otherwise it's identical.
type Iterator[V any] iter.Seq[V]

// Redefined Seq2 so we can define our own methods on it, but otherwise it's identical.
type Iterator2[T any, U any] iter.Seq2[T, U]

// Convert a slice to an Iterator.
func FromSlice[T any](items []T) Iterator[T] {
	return func(yield func(T) bool) {
		for _, item := range items {
			if !yield(item) {
				return
			}
		}
	}
}

// Convert a slice to an Iterator, reversed.
func FromSliceR[T any](items []T) Iterator[T] {
	return func(yield func(T) bool) {
		for i := len(items)-1; i >= 0; i-- {
			if !yield(items[i]) {
				return
			}
		}
	}
}

// Enumerate a slice, creating an `Iterator2`.
func Enumerate[T any](items []T) Iterator2[int, T] {
	return func(yield func(int, T) bool) {
		for i, item := range items {
			if !yield(i, item) {
				return
			}
		}
	}
}

func EnumerateR[T any](items []T) Iterator2[int, T] {
	return func(yield func(int, T) bool) {
		for i := len(items)-1; i >= 0; i-- {
			if !yield(i, items[i]) {
				return
			}
		}
	}
}

func (self Iterator[T]) ToSlice() []T {
	result := []T{}
	self(func(item T) bool {
		result = append(result, item)
		return true
	})
	return result
}

// Can't seem to get this to work for Iterator2
// type Pair[T any, U any] struct {
// 	A T; B T
// }
// func (self Iterator2[T, U]) ToSlice() []Pair[T, U]{
// 	result := []Pair[T, U]{}
// 	self(func(a T, b U) bool {
// 		// result = append(result, Pair{a, b})
// 		result = append(result, Pair[T, U]{a, b})
// 		return true
// 	})
// 	return result
// }

func FromString(str string) Iterator[string] {
	return func(yield func(string) bool) {
		for _, c := range str {
			if !yield(string(c)) {
				return
			}
		}
	}
}

func FromStringR(str string) Iterator[string] {
	return func(yield func(string) bool) {
		for i := len(str)-1; i >= 0; i-- {
			if !yield(string(str[i])) {
				return
			}
		}
	}
}

func (self Iterator[T]) Enumerate() Iterator2[int, T] {
	return func(yield func(int, T) bool) {
		i := 0
		self(func(item T) bool {
			if !yield(i, item) {
				return false
			}
			i++
			return true
		})
	}
}

// Maps over each value in an Iterator and returns a new one with a possibly different type.
func Map[T any, U any](iter Iterator[T], f func(T) U) Iterator[U] {
	return func(yield func(U) bool) {
		iter(func(item T) bool {
			return yield(f(item))
		})
	}
}

// Map this iterator's values, but keep the same type.
func (self Iterator[T]) Map(f func(T) T) Iterator[T] {
	return func(yield func(T) bool) {
		self(func(item T) bool {
			return yield(f(item))
		})
	}
}

// Maps over each pair in an Iterator, but keeps the same type.
func (self Iterator2[T, U]) Map(f func(T, U) (T, U)) Iterator2[T, U] {
	return func(yield func(T, U) bool) {
		self(func (a T, b U) bool {
			return yield(f(a, b))
		})
	}
}

// 
func (self Iterator[T]) Filter(predicate func(T) bool) Iterator[T] {
	return func(yield func(T) bool) {
		self(func(item T) bool {
			if predicate(item) {
				return yield(item)
			}
			return true
		})
	}
}

func (self Iterator2[T, U]) Filter(predicate func(T, U) bool) Iterator2[T, U] {
	return func(yield func(T, U) bool) {
		self(func(a T, b U) bool {
			if predicate(a, b) {
				return yield(a, b)
			}
			return true
		})
	}
}

// Reduce an iterator to a single value with a possibly different type.
func Reduce[T any, U any](seq Iterator[T], initial U, f func(U, T) U) U {
	result := initial
	seq(func(item T) bool {
		result = f(result, item)
		return true
	})
	return result
}

// Reduce an iterator to a single value with the same type.
func (self Iterator[T]) Reduce(initial T, reducer func(T, T) T) T {
	result := initial
	self(func(item T) bool {
		result = reducer(result, item)
		return true
	})
	return result
}

func Take[T any](seq Iterator[T], n int) Iterator[T] {
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

func Drop[T any](seq Iterator[T], n int) Iterator[T] {
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

func TakeWhile[T any](seq Iterator[T], predicate func(T) bool) Iterator[T] {
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
	next, stop := iter.Pull(seq)
	defer stop()
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

// Converts our `Iterator` into a `iter.Seq`
func (iter Iterator[T]) Lift() iter.Seq[T] {
	return func(yield func(T) bool) {
		iter(yield)
	}
}

// Converts our `Iterator2` into a `iter.Seq2`
func (iter Iterator2[T, U]) Lift() iter.Seq2[T, U] {
	return func(yield func(T, U) bool) {
		iter(yield)
	}
}

// Calls `iter.Pull` with our lifted `Iterator` so we can use it in the same way as `iter.Pull`.
func (self Iterator[T]) Pull() (func() (T, bool), func()) {
	return iter.Pull((self.Lift()))
}

// Calls `iter.Pull2` with our lifted `Iterator2` so we can use it in the same way as `iter.Pull2`.
func (self Iterator2[T, U]) Pull() (func() (T, U, bool), func()) {
	return iter.Pull2((self.Lift()))
}

// Returns the first item in the iterator that matches the predicate.
func (self Iterator[T]) Find(predicate func(T) bool) *T {
	next, stop := self.Pull()
	defer stop()
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

// Returns the first pair in the iterator that matches the predicate.
func (self Iterator2[T, U]) Find(predicate func(T, U) bool) (*T, *U) {
	next, stop := self.Pull()
	defer stop()
	for {
		a, b, hasMore := next()
		if !hasMore {
			return nil, nil
		}
		if predicate(a, b) {
			return &a, &b
		}
	}
}