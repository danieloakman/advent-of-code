// Input: https://adventofcode.com/2015/day/3/input
use std::collections::HashMap;

struct Point {
    x: i64,
    y: i64,
}

impl Point {
    /// Move the point in the direction of `char`, e.g. '^' moves the point up.
    pub fn mv(&mut self, char: char) {
        if char == '^' {
            self.y += 1;
        } else if char == 'v' {
            self.y -= 1;
        } else if char == '>' {
            self.x += 1;
        } else if char == '<' {
            self.x -= 1;
        } else {
            panic!("Invalid character: {}", char);
        }
    }
}

/// See [2015/3](https://adventofcode.com/2015/day/3)
pub fn part_one(input: &str) -> Option<i64> {
    let mut houses: HashMap<(i64, i64), i64> = HashMap::new();

    // let mut x = 0;
    // let mut y = 0;
    let mut santa = Point { x: 0, y: 0 };

    // Start at the first house:
    houses.insert((santa.x, santa.y), 1);

    for char in input.chars() {
        santa.mv(char);
        *houses.entry((santa.x, santa.y)).or_insert(0) += 1;
    }

    Some(houses.len() as i64)
}

/// See [2015/3](https://adventofcode.com/2015/day/3#part2)
pub fn part_two(input: &str) -> Option<i64> {
    let mut houses: HashMap<(i64, i64), i64> = HashMap::new();

    let mut santa = Point { x: 0, y: 0 };
    let mut robo_santa = Point { x: 0, y: 0 };

    // Start at the first house:
    houses.insert((santa.x, santa.y), 2);

    for (i, char) in input.chars().enumerate() {
        let s = if i % 2 == 0 {
            &mut santa
        } else {
            &mut robo_santa
        };
        s.mv(char);
        *houses.entry((s.x, s.y)).or_insert(0) += 1;
    }

    Some(houses.len() as i64)
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
        assert_eq!(part_one(">").unwrap(), 2);
        assert_eq!(part_one("^>v<").unwrap(), 4);
        assert_eq!(part_one("^v^v^v^v^v").unwrap(), 2);
    }

    #[test]
    fn test_part_two() {
        assert_eq!(part_two("^v").unwrap(), 3);
        assert_eq!(part_two("^>v<").unwrap(), 3);
        assert_eq!(part_two("^v^v^v^v^v").unwrap(), 11);
    }
}
