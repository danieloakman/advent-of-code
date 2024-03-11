package ndarray

import "danieloakman/aoc/lib/iter"

type NDArray[T any] struct {
	values []T
	shape  []int
}

func New[T any](values []T, shape []int) NDArray[T] {
	// if len(values) != slices.Product(shape) {
	// 	panic("len(values) != slices.Product(shape)")
	// }
	// l := 1
	// for _, v := range shape {
	// 	l *= v
	// }
	// values := make([]T, l)
	return NDArray[T]{values, shape}
}

func NewInt(shape []int) NDArray[int] {
	l := 1
	for _, v := range shape {
		l *= v
	}
	values := make([]int, l)
	return NDArray[int]{values, shape}
}

func (arr NDArray[T]) toIndex(coordinates []int) int {
	index := 0
	multiplier := 1
	for i, v := range coordinates {
		index += v * multiplier
		multiplier *= arr.shape[i]
	}
	return index
}

func (arr NDArray[T]) Get(indices ...int) T {
	return arr.values[arr.toIndex(indices)]
}

func (arr NDArray[T]) Set(value T, indices ...int) {
	index := arr.toIndex(indices)
	arr.values[index] = value
}

func (arr NDArray[T]) Shape() []int {
	return arr.shape
}

func (arr NDArray[T]) Points() iter.Iterator2[[]int, T] {
	return func(yield func(coords []int, value T) bool) {
		indices := make([]int, len(arr.shape))
		for i := 0; i < len(arr.values); i++ {
			indices[i]++
			if indices[i] == arr.shape[i] {
				indices[i] = 0
			} else {
				break
			}
		}
		if !yield(indices, arr.values[arr.toIndex(indices)]) {
			return
		}
	}
}

func (arr NDArray[T]) Values() iter.Iterator[T] {
	return iter.FromSlice(arr.values)
}
