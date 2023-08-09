use memoize::memoize;

#[derive(Clone)]
struct Solution {
    floor: i16,
    first_basement: u32,
}

#[memoize]
fn solver(input: String) -> Option<Solution> {
    let mut floor: i16 = 0;
    let mut first_basement: u32 = 0;
    let mut char_num: u32 = 0;
    for c in input.chars() {
        char_num += 1;
        if c == '(' {
            floor += 1;
        } else {
            floor -= 1;
        }
        if floor == -1 && first_basement == 0 {
            first_basement = char_num;
        }
    }

    Some(Solution {
        floor,
        first_basement,
    })
}

pub fn part_one(input: &str) -> Option<u32> {
    return solver(input.to_string()).map(|s| s.floor as u32);
}

pub fn part_two(input: &str) -> Option<u32> {
    return solver(input.to_string()).map(|s| s.first_basement as u32);
}

fn main() {
    let input = &aoc::read_input_file(2015, 1);
    aoc::solve!(1, part_one, input);
    aoc::solve!(2, part_two, input);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part_one() {
        let input = aoc::read_input_file(2015, 1);
        assert_eq!(part_one(&input), None);
    }

    #[test]
    fn test_part_two() {
        let input = aoc::read_input_file(2015, 1);
        assert_eq!(part_two(&input), None);
    }
}
