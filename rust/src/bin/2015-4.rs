// Input: https://adventofcode.com/2015/day/4/input


fn hash(input: &str) -> String {
    format!("{:x}", md5::compute(input))
}

fn find_prefix(input: &str, prefix: &str) -> Option<u64> {
    for i in 0.. {
        let s = format!("{input}{i}");
        let h = hash(&s);
        if h.starts_with(prefix) {
            return Some(i);
        }
    }

    None
}

/// See [2015/4](https://adventofcode.com/2015/day/4)
pub fn part_one(input: &str) -> Option<u64> {
    find_prefix(input, "00000")
}

/// See [2015/4](https://adventofcode.com/2015/day/4#part2)
pub fn part_two(input: &str) -> Option<u64> {
    find_prefix(input, "000000")
}

fn main() {
    let input = &aoc::get_input(2015, 4);
    aoc::solve!(1, part_one, input.trim());
    aoc::solve!(2, part_two, input);
}

#[cfg(test)]
mod tests_2015_4 {
    use super::*;

    #[test]
    #[ignore]
    fn test_part_one() {
        assert!(hash("abcdef609043").starts_with("00000"));
        assert!(hash("pqrstuv1048970").starts_with("00000"));
        assert_eq!(part_one("abcdef"), Some(609043));
        assert_eq!(part_one("pqrstuv"), Some(1048970));
    }

    // #[test]
    // fn test_part_two() {
    // }
}
