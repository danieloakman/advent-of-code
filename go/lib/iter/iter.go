package iter

import (
	"iter"
)

// Redefined `Seq` so we can define our own methods on it, but otherwise it's identical.
type Iterator[V any] iter.Seq[V]

// Redefined Seq2 so we can define our own methods on it, but otherwise it's identical.
type Iterator2[T any, U any] iter.Seq2[T, U]

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
func (_iter Iterator[T]) Pull() (func() (T, bool), func()) {
	return iter.Pull((_iter.Lift()))
}

// Calls `iter.Pull2` with our lifted `Iterator2` so we can use it in the same way as `iter.Pull2`.
func (_iter Iterator2[T, U]) Pull() (func() (T, U, bool), func()) {
	return iter.Pull2((_iter.Lift()))
}

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
		for i := len(items) - 1; i >= 0; i-- {
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

// Enumerate a slice, creating an `Iterator2`, reversed.
func EnumerateR[T any](items []T) Iterator2[int, T] {
	return func(yield func(int, T) bool) {
		for i := len(items) - 1; i >= 0; i-- {
			if !yield(i, items[i]) {
				return
			}
		}
	}
}

// Enumerate through an iterator, creating an `Iterator2[int, T]`.
func (iter Iterator[T]) Enumerate() Iterator2[int, T] {
	return func(yield func(int, T) bool) {
		i := 0
		iter(func(item T) bool {
			if !yield(i, item) {
				return false
			}
			i++
			return true
		})
	}
}

// Iterate through all values in this iterator and collect them into a slice.
func (iter Iterator[T]) ToSlice() []T {
	result := []T{}
	iter(func(item T) bool {
		result = append(result, item)
		return true
	})
	return result
}

// Can't seem to get this to work for Iterator2
// type Pair[T any, U any] struct {
// 	A T; B T
// }
// func (iter Iterator2[T, U]) ToSlice() []Pair[T, U]{
// 	result := []Pair[T, U]{}
// 	iter(func(a T, b U) bool {
// 		// result = append(result, Pair{a, b})
// 		result = append(result, Pair[T, U]{a, b})
// 		return true
// 	})
// 	return result
// }

// Convert a string to an Iterator.
func FromString(str string) Iterator[string] {
	return func(yield func(string) bool) {
		for _, c := range str {
			if !yield(string(c)) {
				return
			}
		}
	}
}

// Convert a string to an Iterator, reversed.
func FromStringR(str string) Iterator[string] {
	return func(yield func(string) bool) {
		for i := len(str) - 1; i >= 0; i-- {
			if !yield(string(str[i])) {
				return
			}
		}
	}
}

// Maps over each value in an Iterator and returns a new one with a possibly different type.
func MapTo[T any, U any](iter Iterator[T], iteratee func(T) U) Iterator[U] {
	return func(yield func(U) bool) {
		iter(func(item T) bool {
			return yield(iteratee(item))
		})
	}
}

// func MapTo2[T any, U any, V any](iter Iterator2[T, U], iteratee func(T, U) V) Iterator[V] {
// 	return func(yield func(V) bool) {
// 		iter(func(a T, b U) bool {
// 			return yield(iteratee(a, b))
// 		})
// 	}
// }

// Map this iterator's values, but keep the same type.
func (iter Iterator[T]) Map(iteratee func(T) T) Iterator[T] {
	return MapTo(iter, iteratee)
}

// Maps over each pair in an Iterator, but keeps the same type.
func (iter Iterator2[T, U]) Map(f func(T, U) (T, U)) Iterator2[T, U] {
	return func(yield func(T, U) bool) {
		iter(func(a T, b U) bool {
			return yield(f(a, b))
		})
	}
}

// Filter this iterator using a predicate.
func (iter Iterator[T]) Filter(predicate func(T) bool) Iterator[T] {
	return func(yield func(T) bool) {
		iter(func(item T) bool {
			if predicate(item) {
				return yield(item)
			}
			return true
		})
	}
}

// Filter this iterator using a predicate.
func (iter Iterator2[T, U]) Filter(predicate func(T, U) bool) Iterator2[T, U] {
	return func(yield func(T, U) bool) {
		iter(func(a T, b U) bool {
			if predicate(a, b) {
				return yield(a, b)
			}
			return true
		})
	}
}

func FilterMapTo[T any, U any](iter Iterator[T], iteratee func(T) *U) Iterator[U] {
	return func(yield func(U) bool) {
		iter(func(item T) bool {
			mapped := iteratee(item)
			if mapped != nil {
				return yield(*mapped)
			}
			return true
		})
	}
}

func (iter Iterator[T]) FilterMap(iteratee func(T) *T) Iterator[T] {
	return FilterMapTo(iter, iteratee)
}

func FlatMapTo[T any, U any](iter Iterator[T], iteratee func(T) Iterator[U]) Iterator[U] {
	return func(yield func(U) bool) {
		iter(func(item T) bool {
			inner := iteratee(item)
			inner(func(innerItem U) bool {
				return yield(innerItem)
			})
			return true
		})
	}
}

func (iter Iterator[T]) FlatMap(iteratee func(T) Iterator[T]) Iterator[T] {
	return FlatMapTo(iter, iteratee)
}

// ReduceTo an iterator to a single value with a possibly different type.
func ReduceTo[T any, U any](seq Iterator[T], initial U, reducer func(U, T) U) U {
	seq(func(item T) bool {
		initial = reducer(initial, item)
		return true
	})
	return initial
}

// TODO: maybe need Reduce2?

// Reduce an iterator to a single value with the same type.
func (iter Iterator[T]) Reduce(initial T, reducer func(T, T) T) T {
	return ReduceTo(iter, initial, reducer)
}

// Only take the first `n` items from this iterator.
func (iter Iterator[T]) Take(n int) Iterator[T] {
	return func(yield func(T) bool) {
		i := 0
		iter(func(item T) bool {
			if i >= n {
				return false
			}
			i++
			return yield(item)
		})
	}
}

// Only take the first `n` items from this iterator.
func (iter Iterator2[T, U]) Take(n int) Iterator2[T, U] {
	return func(yield func(T, U) bool) {
		i := 0
		iter(func(a T, b U) bool {
			if i >= n {
				return false
			}
			i++
			return yield(a, b)
		})
	}
}

// Drop or *don't* take the first `n` items from this iterator.
func (iter Iterator[T]) Drop(n int) Iterator[T] {
	return func(yield func(T) bool) {
		i := 0
		iter(func(item T) bool {
			if i < n {
				i++
				return true
			}
			return yield(item)
		})
	}
}

// Drop or *don't* take the first `n` items from this iterator.
func (iter Iterator2[T, U]) Drop(n int) Iterator2[T, U] {
	return func(yield func(T, U) bool) {
		i := 0
		iter(func(a T, b U) bool {
			if i < n {
				i++
				return true
			}
			return yield(a, b)
		})
	}
}

// Slice the iterator from `start` to `end`.
func (iter Iterator[T]) Slice(start int, end int) Iterator[T] {
	return func(yield func(T) bool) {
		i := 0
		iter(func(item T) bool {
			if i >= start && i < end {
				return yield(item)
			}
			i++
			return true
		})
	}
}

// Slice the iterator from `start` to `end`.
func (iter Iterator2[T, U]) Slice(start int, end int) Iterator2[T, U] {
	return func(yield func(T, U) bool) {
		i := 0
		iter(func(a T, b U) bool {
			if i >= start && i < end {
				return yield(a, b)
			}
			i++
			return true
		})
	}
}

// Take items from the iterator while the predicate is true.
func (iter Iterator[T]) TakeWhile(predicate func(T) bool) Iterator[T] {
	return func(yield func(T) bool) {
		iter(func(item T) bool {
			if !predicate(item) {
				return false
			}
			return yield(item)
		})
	}
}

// Take items from the iterator while the predicate is true.
func (iter Iterator2[T, U]) TakeWhile(predicate func(T, U) bool) Iterator2[T, U] {
	return func(yield func(T, U) bool) {
		iter(func(a T, b U) bool {
			if !predicate(a, b) {
				return false
			}
			return yield(a, b)
		})
	}
}

// Returns true if the predicate is true for any item in the iterator.
func (iter Iterator[T]) Some(predicate func(T) bool) bool {
	next, stop := iter.Pull()
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

// Returns true if the predicate is true for any pair in the iterator.
func (iter Iterator2[T, U]) Some(predicate func(T, U) bool) bool {
	next, stop := iter.Pull()
	defer stop()
	for {
		a, b, hasMore := next()
		if !hasMore {
			return false
		}
		if predicate(a, b) {
			return true
		}
	}
}

// Returns true if every item in the iterator matches the predicate.
func (iter Iterator[T]) Every(predicate func(T) bool) bool {
	next, stop := iter.Pull()
	defer stop()
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

// Returns true if every pair in the iterator matches the predicate.
func (iter Iterator2[T, U]) Every(predicate func(T, U) bool) bool {
	next, stop := iter.Pull()
	defer stop()
	for {
		a, b, hasMore := next()
		if !hasMore {
			return true
		}
		if !predicate(a, b) {
			return false
		}
	}
}

// Returns the first item in the iterator that matches the predicate.
func (iter Iterator[T]) Find(predicate func(T) bool) *T {
	next, stop := iter.Pull()
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
func (iter Iterator2[T, U]) Find(predicate func(T, U) bool) (*T, *U) {
	next, stop := iter.Pull()
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

// Pairs up each item in the iterator with the next one.
// E.g. [1, 2, 3, 4] -> [(1, 2), (2, 3), (3, 4)]
func Pairwise[T any](iter Iterator[T]) Iterator2[T, T] {
	var prev *T
	return func(yield func(T, T) bool) {
		iter(func(item T) bool {
			if prev != nil {
				if !yield(*prev, item) {
					return false
				}
			}
			prev = &item
			return true
		})
	}
}

func rangeIter(start int, stop int, step int) Iterator[int] {
	done := func(i int) bool {
		if step > 0 {
			return i >= stop
		} else {
			return i <= stop
		}
	}
	return func(yield func(int) bool) {
		for i := start; !done(i); i += step {
			if !yield(i) {
				return
			}
		}
	}
}

// Creates an iterator that counts up from `start` to `stop` with increments of `step`.
func Range(startStopStep ...int) Iterator[int] {
	switch len(startStopStep) {
	case 1:
		return func(yield func(int) bool) {
			for i := range startStopStep[0] {
				if !yield(i) {
					return
				}
			}
		}
	case 2:
		step := 1
		if startStopStep[1] < startStopStep[0] {
			step = -1
		}
		return rangeIter(startStopStep[0], startStopStep[1], step)
	case 3:
		return rangeIter(startStopStep[0], startStopStep[1], startStopStep[2])
	}
	panic("Range: invalid number of arguments")
}

func Count(stop ...int) Iterator[int] {
	if len(stop) > 1 {
		panic("Count: invalid number of arguments")
	} else if len(stop) == 1 {
		return Range(stop[0])
	}
	return func(yield func(int) bool) {
		i := 0
		for {
			if !yield(i) {
				return
			}
			i++
		}
	}
}

// An iterator that repeats `item` `times` times.
func Repeat[T any](item T, times int) Iterator[T] {
	return func(yield func(T) bool) {
		for i := 0; i < times; i++ {
			if !yield(item) {
				return
			}
		}
	}
}

func Empty[T any]() Iterator[T] {
	return func(yield func(T) bool) {}
}

func Empty2[T any, U any]() Iterator2[T, U] {
	return func(yield func(T, U) bool) {}
}

func Concat[T any](iters ...Iterator[T]) Iterator[T] {
	return func(yield func(T) bool) {
		for _, iter := range iters {
			iter(func(item T) bool {
				return yield(item)
			})
		}
	}
}

// func Concat2[T any, U any](iters ...Iterator2[T, U]) Iterator2[T, U] {
// 	return func(yield func(T, U) bool) {
// 		for _, iter := range iters {
// 			iter(func(a T, b U) bool {
// 				return yield(a, b)
// 			})
// 		}
// 	}
// }

func Zip[T any, U any](a Iterator[T], b Iterator[U]) Iterator2[T, U] {
	return func(yield func(T, U) bool) {
		nextA, stopA := a.Pull()
		nextB, stopB := b.Pull()
		defer stopA()
		defer stopB()
		for {
			itemA, hasMoreA := nextA()
			itemB, hasMoreB := nextB()
			if !hasMoreA || !hasMoreB {
				return
			}
			if !yield(itemA, itemB) {
				return
			}
		}
	}
}

func ZipAny[T any](iters ...Iterator[T]) Iterator[T] {
	return func(yield func(T) bool) {
		pulls := make([]func() (T, bool), len(iters))
		stops := make([]func(), len(iters))
		for i, iter := range iters {
			pulls[i], stops[i] = iter.Pull()
			defer stops[i]()
		}
		for {
			for _, pull := range pulls {
				item, hasMore := pull()
				if !hasMore {
					return
				}
				if !yield(item) {
					return
				}
			}
		}
	}
}

func ZipLongest[T any, U any](a Iterator[T], b Iterator[U], fillValueT T, fillValueU U) Iterator2[T, U] {
	return func(yield func(T, U) bool) {
		nextA, stopA := a.Pull()
		nextB, stopB := b.Pull()
		defer stopA()
		defer stopB()
		for {
			itemA, hasMoreA := nextA()
			itemB, hasMoreB := nextB()

			if !hasMoreA && !hasMoreB {
				return
			} else if !hasMoreA {
				itemA = fillValueT
			} else if !hasMoreB {
				itemB = fillValueU
			}

			if !yield(itemA, itemB) {
				return
			}
		}
	}
}

func (iter Iterator[T]) Zip(b Iterator[T]) Iterator2[T, T] {
	return Zip(iter, b)
}

func (iter Iterator[T]) ZipLongest(b Iterator[T], fillValue T) Iterator2[T, T] {
	return ZipLongest(iter, b, fillValue, fillValue)
}

func (iter Iterator[T]) Unique(key func(T) int) Iterator[T] {
	seen := map[int]bool{}
	return iter.Filter(func(item T) bool {
		k := key(item)
		if seen[k] {
			return false
		}
		seen[k] = true
		return true
	})
}

func (iter Iterator[T]) UniqueJustSeen(key func(T) int) Iterator[T] {
	var lastSeen *int = nil
	return iter.Filter(func(item T) bool {
		k := key(item)
		if lastSeen != nil && *lastSeen == k {
			return false
		}
		lastSeen = &k
		return true
	})
}

// Iterates through the iterator and calls `effect` on each item but without modifying the value.
func (iter Iterator[T]) Tap(effect func(T)) Iterator[T] {
	return iter.Map(func(value T) T {
		effect(value)
		return value
	})
}

// Iterates through the iterator and calls `effect` on each pair but without modifying the value.
func (iter Iterator2[A, B]) Tap(effect func(a A, b B)) Iterator2[A, B] {
	return iter.Map(func(a A, b B) (A, B) {
		effect(a, b)
		return a, b
	})
}

// Iterates through all values in this iterator and calls `iteratee` on each one.
func (iter Iterator[T]) Each(iteratee func(T)) {
	iter(func (value T) bool {
		iteratee(value)
		return true
	})
}

// Iterates through all pairs in this iterator and calls `iteratee` on each one.
func (iter Iterator2[A, B]) Each(iteratee func(a A, b B)) {
	iter(func (a A, b B) bool {
		iteratee(a, b)
		return true
	})
}

// Consumes the iterator by iterating through it.
func (iter Iterator[T]) Consume() {
	iter(func (_ T) bool {
		return true
	})
}

// Consumes the iterator by iterating through it.
func (iter Iterator2[A, B]) Consume() {
	iter(func (_ A, _ B) bool {
		return true
	})
}