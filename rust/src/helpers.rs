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

pub fn char_at(string: &str, index: usize) -> Option<&str> {
    if index < string.len() {
        Some(&string[index..index + 1])
    } else {
        None
    }
}

/// Creates a HashMap with some nifty syntax.
/// 
/// #### Example
/// ```rust
/// use aoc::map;
/// use std::collections::HashMap;
/// let mut map1 = map!(String, u64);
/// let mut map2 = map!(
///     "id1".to_owned() => 0,
///     "id2".to_owned() => 1
/// );
/// ```
#[macro_export]
macro_rules! map {
    ($key:ty, $val:ty) => {
        {
            let map: HashMap<$key, $val> = HashMap::new();
            map
        }
    };
    ($($key:expr => $val:expr),*) => {
        {
            let mut map = HashMap::new();
            $(
                map.insert($key, $val);
            )*
            map
        }
    };
}

#[cfg(test)]
mod tests_helpers {
    use super::*;
    use std::collections::HashMap;

    #[test]
    fn test_it_len() {
        assert_eq!(it_len(vec![1, 2, 3].into_iter()), 3);
        assert_eq!(it_len(vec![1, 2, 3, 4].into_iter()), 4);
    }

    #[test]
    fn test_pairwise() {
        let mut iter = pairwise(vec![1, 2, 3, 4].into_iter());
        assert_eq!(iter.next(), Some((1, 2)));
        assert_eq!(iter.next(), Some((2, 3)));
        assert_eq!(iter.next(), Some((3, 4)));
        assert_eq!(iter.next(), None);
    }

    #[test]
    fn test_char_at() {
        assert_eq!(char_at("abc", 0), Some("a"));
        assert_eq!(char_at("abc", 1), Some("b"));
        assert_eq!(char_at("abc", 2), Some("c"));
        assert_eq!(char_at("abc", 3), None);
    }

    #[test]
    fn test_map() {
        let map1 = map!(String, u64);
        let map2 = map!(
            "id1" => 0,
            "id2" => 1
        );
        assert_eq!(map1.len(), 0);
        assert_eq!(map2.len(), 2);
    }
}