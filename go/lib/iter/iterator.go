package iter

import "strings"

// type Iterator[T any] func(yield func(T) bool)

// func ToIterator[T any](items []T) func(yield func(T) bool) {
// 	return func(yield func(value T) bool) {
// 		for _, v := range items {
// 			if !yield(v) {
// 				return
// 			}
// 		}
// 	}
// }

// // Convert Iterator to a slice.
// func ToArray[T any](iter Iterator[T]) []T {
// 	result := []T{}
// 	iter(func(value T) bool {
// 		result = append(result, value)
// 		return true
// 	})
// 	return result
// }

// func A() {
// 	a := ToArray(ToIterator([]int{1, 2, 3}))
// 	for _, v := range a {
// 		println(v)
// 	}
// }

// An Iterator is a function that yields values T and a bool signalling
// whether there are more values.
type Iterator[T any] func() (*T, bool)

func FromSlice[T any](items []T) Iterator[T] {
	i := 0
	return func() (*T, bool) {
		if i >= len(items) {
			return nil, true
		}
		i++
		return &items[i-1], false
	}
}

func (iter Iterator[T]) ToSlice() []T {
	result := []T{}
	for {
		value, done := iter()
		if !done {
			return result
		}
		result = append(result, *value)
	}
}

func FromString(str string, sep string) Iterator[string] {
	return FromSlice(strings.Split(str, sep))
}

func Map[T any, U any](iter Iterator[T], f func(*T) U) Iterator[U] {
	return func() (*U, bool) {
		value, done := iter()
		if done {
			return nil, true
		}
		next := f(value)
		return &next, false
	}
}

func (iter Iterator[T]) Filter(f func(*T) bool) Iterator[T] {
	return func() (*T, bool) {
		for {
			value, done := iter()
			if done {
				return nil, true
			}
			if f(value) {
				return value, false
			}
		}
	}
}

func (iter Iterator[T]) Each(f func(*T)) {
	for {
		value, done := iter()
		if done {
			return
		}
		f(value)
	}
}

func Reduce[T any, U any](iter Iterator[T], initial U, f func(U, *T) U) U {
	result := initial
	for {
		value, done := iter()
		if done {
			return result
		}
		result = f(result, value)
	}
}
