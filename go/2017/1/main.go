package main

import (
	// "danieloakman/aoc/lib"
	// "danieloakman/aoc/lib/iter_util"
	"iter"
)

// func take[T any](seq iter.Seq[T]) iter.Seq[T] {
// 	return iter.Seq[T]{
// 		Next: func() *T {
// 			return seq.Next()
// 		},
// 	}
// }

func backward2[E any](s []E) iter.Seq2[int, E] {
	return func(yield func(int, E) bool) {
		for i := len(s)-1; i >= 0; i-- {
			if !yield(i, s[i]) {
				return
			}
		}
	}
}

func backward[T any](s []T) iter.Seq[T] {
	return func(yield func(T) bool) {
		for i := len(s)-1; i >= 0; i-- {
			if !yield(s[i]) {
				return
			}
		}
	}
}

func main () {
	nums := []int{1, 2, 3}
	it := backward(nums)
	n, s := iter.Pull(it)
	v, cont := n()
	println(v, cont)
	v, cont = n()
	println(v, cont)
	v, cont = n()
	println(v, cont)
	v, cont = n()
	println(v, cont)
	v, cont = n()
	println(v, cont)
	s()
	// for i := range backward(nums) {
	// 	println(i)
	// }
	// input := lib.GetInput(2015, 1)
	// println(input)
	// it := iter.FromString(input)
	// println(it)
}
