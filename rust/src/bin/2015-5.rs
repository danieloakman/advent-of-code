// Input: https://adventofcode.com/2015/day/5/input

#[macro_use]
extern crate lazy_static;
use aoc::helpers::*;
use std::collections::{HashSet, HashMap};

lazy_static! {
    static ref NOT_ALLOWED: HashSet<&'static str> = HashSet::from(["ab", "cd", "pq", "xy"]);
    static ref VOWELS: HashSet<&'static str> = HashSet::from(["a", "e", "i", "o", "u"]);
}

fn is_nice(str: &str) -> bool {
    if NOT_ALLOWED.iter().any(|s| str.contains(s)) {
        return false;
    }

    let mut has_double = false;
    let mut vowel_count = 0;
    // for (c1, c2) in pairwise(str.chars().map(|c| c.to_string())) {
    for (i, c) in str.chars().map(|n| n.to_owned().to_string()).enumerate() {
        let char = c.as_str();
        let next = if i + 1 < str.len() {
            &str[i + 1..i + 2]
        } else {
            ""
        };
        // let next = next.to_owned().to_string();
        if VOWELS.contains(char) {
            vowel_count += 1;
        }
        if char == next {
            has_double = true;
        }
        if has_double && vowel_count > 2 {
            return true;
        }
    }

    false
}

fn is_nice_2(input: &str) -> bool {
    // let bytes = input.as_bytes().to_owned();
    let mut map: HashMap<&str, usize>  = HashMap::new();
    let mut contains_two_pairs = false;
    let mut contains_repeat = false;

    for i in 0..input.len() {
        if i < input.len() - 1 && !contains_two_pairs {
            let pair = &input[i..i + 2];
            let value = map.get(pair);
            if value.is_none() {
                map.insert(pair, 1);
            } else if value.unwrap() != &i && value.unwrap() != &(i + 1) {
                contains_two_pairs = true;
            }
        }
        if i < input.len() - 2 && !contains_repeat {
            let pair = &input[i..i + 3];
            if char_at(pair, 0) == char_at(pair, 2) {
                contains_repeat = true;
            }
        }
        if contains_two_pairs && contains_repeat {
            return true;
        }
    }

    contains_two_pairs && contains_repeat
}

/// See [2015/5](https://adventofcode.com/2015/day/5)
pub fn part_one(input: &str) -> Option<u64> {
    Some(it_len(
        input
            .split('\n')
            .filter(|s| !s.is_empty())
            .filter(|s| is_nice(s)),
    ))
}

/// See [2015/5](https://adventofcode.com/2015/day/5#part2)
pub fn part_two(_input: &str) -> Option<u64> {
    todo!("Part 2 answer is wrong");
    // Some(it_len(
    //     input
    //         .split('\n')
    //         .filter(|s| !s.is_empty())
    //         .filter(|s| is_nice_2(s)))
    // )
}

fn main() {
    let input = &aoc::get_input(2015, 5);
    aoc::solve!(1, part_one, input);
    aoc::solve!(2, part_two, input);
}

#[cfg(test)]
mod tests_2015_5 {
    use super::*;

    #[test]
    fn test_part_one() {
        assert!(is_nice("ugknbfddgicrmopn"));
        assert!(is_nice("aaa"));
        assert!(!is_nice("jchzalrnumimnmhp"));
        assert!(!is_nice("haegwjzuvuyypxyu"));
        assert!(!is_nice("dvszwmarrgswjxmb"));
    }

    #[test]
    fn test_part_two() {
        assert!(is_nice_2("qjhvhtzxzqqjkmpb"));
        assert!(is_nice_2("xxyxx"));
        assert!(!is_nice_2("uurcxstgmygtbstg"));
        assert!(!is_nice_2("ieodomkazucvgmuy"));
    }
}
