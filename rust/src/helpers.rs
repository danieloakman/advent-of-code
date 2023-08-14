/*
 * Use this file if you want to extract helpers from your solutions.
 * Example import from this file: `use advent_of_code::helpers::example_fn;`.
 */
// use std::sync::Once;

// /// Call `f` once and return the same result every time.
// pub fn once<T>(f: T) -> || -> bool {
//     static ONCE: Once = Once::new();
//     let closure = || {
//         ONCE.call_once(f);
//     };
//     closure
// }

// #[cfg(test)]
// mod tests_helpers {
//     use super::*;

//     #[test]
//     fn test_once() {
//         let mut counter = 0;
//         let f = once(|| {
//             counter += 1;
//             counter
//         });
//         f();
//         // once(|| counter += 1);
//         assert_eq!(counter, 1);
//     }
// }

pub fn it_len<T>(iter: impl Iterator<Item = T>) -> u64 {
    iter.fold(0, |acc, _| acc + 1)
}

pub fn pairwise<T>(iter: impl Iterator<Item = T>) -> impl Iterator<Item = (T, T)> where T: Clone {
    let mut iter = iter.peekable();
    std::iter::from_fn(move || {
        let current = iter.next()?;
        let next = iter.peek()?;
        Some((current, next.clone()))
    })
}
