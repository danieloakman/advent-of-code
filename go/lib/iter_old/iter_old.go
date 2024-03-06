// This is the old version of an iterator package I wrote before go 1.22
package iter_old

// An Iterator is a function that yields values T and a bool signalling
// whether there are more values.
type Iterator[T any] func() (*T, bool)

// Convert a slice to an Iterator.
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

// Converts a string to an Iterator
func FromString(str string) Iterator[string] {
	result := []string{}
	for i := range str {
		result = append(result, string(str[i]))
	}
	return FromSlice(result)
}

// Maps over each value in an Iterator and returns a new one.
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

func (iter Iterator[T]) Next() *T {
	value, _ := iter()
	return value
}

// Convert an Iterator to a slice.
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

// Filters this Iterator using a predicate.
func (iter Iterator[T]) Filter(predicate func(*T) bool) Iterator[T] {
	return func() (*T, bool) {
		for {
			value, done := iter()
			if done {
				return nil, true
			}
			if predicate(value) {
				return value, false
			}
		}
	}
}

// Loops over all values in this Iterator.
func (iter Iterator[T]) Each(iteratee func(*T)) {
	for {
		value, done := iter()
		if done {
			return
		}
		iteratee(value)
	}
}

func Reduce[T any, U any](iter Iterator[T], initial U, reducer func(U, *T) U) U {
	result := initial
	for {
		value, done := iter()
		if done {
			return result
		}
		result = reducer(result, value)
	}
}

func (iter Iterator[T]) Some(predicate func(*T) bool) bool {
	for {
		value, done := iter()
		if done {
			return false
		}
		if predicate(value) {
			return true
		}
	}
}

func (iter Iterator[T]) Every(predicate func(*T) bool) bool {
	for {
		value, done := iter()
		if done {
			return true
		}
		if !predicate(value) {
			return false
		}
	}
}

func (iter Iterator[T]) Find(predicate func(*T) bool) *T {
	for {
		value, done := iter()
		if done {
			return nil
		}
		if predicate(value) {
			return value
		}
	}
}

func (iter Iterator[T]) Take(n int) []T {
	taken := 0
	result := []T{};
	for {
		if taken > n {
			break
		}
		value, done := iter()
		if done {
			break
		}
		result = append(result, *value)
	}
	return result
}

func (iter Iterator[T]) TakeWhile(predicate func(*T) bool) Iterator[T] {
	return func() (*T, bool) {
		value, done := iter()
		if done {
			return nil, true
		}
		if predicate(value) {
			return value, false
		}
		return nil, true
	}
}
