package ndarray

import "danieloakman/aoc/lib/iter"

type NDArray[T any] struct {
	values []T
	shape  []int
}

type PointValue[T any] struct {
	Coords []int
	Value  T
}

func New[T any](values []T, shape []int) NDArray[T] {
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

func NewInt64(shape []int) NDArray[int64] {
	l := 1
	for _, v := range shape {
		l *= v
	}
	values := make([]int64, l)
	return NDArray[int64]{values, shape}
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

// func (arr NDArray[T]) toCoord(index int) []int {
// 	result := make([]int, len(arr.shape))
// 	multiplier := 1
// 	for i := 0; i < len(arr.shape); i++ {
// 		result[i] = (index / multiplier) % arr.shape[i]
// 		multiplier *= arr.shape[i]
// 	}
// 	return result
// }

func (arr NDArray[T]) Get(coords ...int) T {
	return arr.values[arr.toIndex(coords)]
}

func (arr NDArray[T]) Set(value T, coords ...int) {
	index := arr.toIndex(coords)
	arr.values[index] = value
}

func (arr NDArray[T]) SetAll(value T) {
	for i := 0; i < len(arr.values); i++ {
		arr.values[i] = value
	}
}

func (arr NDArray[T]) Update(coords []int, updater func(T) T) {
	index := arr.toIndex(coords)
	arr.values[index] = updater(arr.values[index])
}

func (arr NDArray[T]) Has(coords ...int) bool {
	index := arr.toIndex(coords)
	return index < 0 || index >= len(arr.values)
}

func (arr NDArray[T]) Shape() []int {
	return arr.shape
}

func (arr NDArray[T]) Iter() iter.Iterator[PointValue[T]] {
	return func(yield func(point PointValue[T]) bool) {
		indices := make([]int, len(arr.shape))
		for i := 0; i < len(arr.values); i++ {
			yield(PointValue[T]{indices, arr.values[i]})
			for j := 0; j < len(indices); j++ {
				indices[j]++
				if indices[j] < arr.shape[j] {
					break
				}
				indices[j] = 0
			}
		}
	}
}

func (arr NDArray[T]) Values() iter.Iterator[T] {
	return iter.FromSlice(arr.values)
}

func (arr NDArray[T]) Neighbours2D(coords ...int) iter.Iterator[PointValue[T]] {
	return func(yield func(PointValue[T]) bool) {
		for i := -1; i <= 1; i++ {
			for j := -1; j <= 1; j++ {
				if i == 0 && j == 0 {
					continue
				}
				newCoords := make([]int, len(coords))
				copy(newCoords, coords)
				newCoords[0] += i
				newCoords[1] += j
				if !arr.Has(newCoords...) {
					continue
				}
				yield(PointValue[T]{newCoords, arr.Get(newCoords...)})
			}
		}
	}
}

