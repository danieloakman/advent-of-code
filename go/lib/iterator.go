package lib

type Iterator[T any] func(yield func(T) bool)

func ToIterator[T any](items []T) func(yield func(T) bool) {
	return func (yield func(value T) bool) {
		for _, v := range items {
			if !yield(v) {
				return
			}
		}
	}
}

// func Map[T any, R any](it Iterator[T]) Iterator[R] {
// 	return func (yield func(value T) bool) {
// 		v := it()
// 	}
// }
