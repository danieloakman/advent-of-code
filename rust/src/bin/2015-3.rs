// Input: https://adventofcode.com/2015/day/3/input

/// See [2015/3](https://adventofcode.com/2015/day/3)
pub fn part_one(input: &str) -> Option<i64> {
    None
}

/// See [2015/3](https://adventofcode.com/2015/day/3#part2)
pub fn part_two(input: &str) -> Option<i64> {
    None
}

fn main() {
    let input = &aoc::get_input(2015, 3);
    aoc::solve!(1, part_one, input);
    aoc::solve!(2, part_two, input);
}

#[cfg(test)]
mod tests_2015_3 {
    use super::*;

    #[test]
    fn test_part_one() {
        let input = aoc::get_input(2015, 3);
        assert_ne!(part_one(&input), None);
    }

    #[test]
    fn test_part_two() {
        let input = aoc::get_input(2015, 3);
        assert_ne!(part_two(&input), None);
    }
}
