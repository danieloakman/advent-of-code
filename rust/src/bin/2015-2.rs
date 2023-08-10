// Input: https://adventofcode.com/2015/day/2/input

/// See [2015/2](https://adventofcode.com/2015/day/2)
pub fn part_one(input: &str) -> Option<i64> {
    None
}

/// See [2015/2](https://adventofcode.com/2015/day/2#part2)
pub fn part_two(input: &str) -> Option<i64> {
    None
}

fn main() {
    let input = &aoc::read_input_file(2015, 2);
    aoc::solve!(1, part_one, input);
    aoc::solve!(2, part_two, input);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part_one() {
        let input = aoc::read_input_file(2015, 2);
        assert_ne!(part_one(&input), None);
    }

    #[test]
    fn test_part_two() {
        let input = aoc::read_input_file(2015, 2);
        assert_ne!(part_two(&input), None);
    }
}
