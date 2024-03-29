// Input: https://adventofcode.com/2015/day/6/input

use aoc::helpers::Vec2D;
use itertools::Itertools;
use regex::Regex;

type Point = (u32, u32);

fn commands(str: &str) -> Box<dyn Iterator<Item = (&str, Point, Point)> + '_> {
    let not_numbers = Regex::new(r"^\D+").unwrap();
    Box::new(str.split('\n').filter(|s| !s.is_empty()).map(move |s| {
        let cmd = not_numbers.find(s).unwrap().as_str().trim();
        let replaced = s.replace(cmd, "");
        let mut nums = replaced.trim().split(" through ").map(|nums| {
            nums.split(',')
                .map(|n| n.parse::<u32>().unwrap())
                .next_tuple()
                .unwrap()
        });
        (cmd, nums.next().unwrap(), nums.next().unwrap())
    }))
}

fn points_within(start: Point, end: Point) -> Box<dyn Iterator<Item = Point>> {
    Box::new((start.0..end.0 + 1).flat_map(move |x| (start.1..end.1 + 1).map(move |y| (x, y))))
}

/// See [2015/6](https://adventofcode.com/2015/day/6)
pub fn part_one(input: &str) -> Option<u32> {
    let cmds = commands(input);
    let mut lights = Vec2D::new(0, 1000);

    for (cmd, start, end) in cmds {
        for (x, y) in points_within(start, end) {
            let _ = match cmd {
                "turn on" => lights.set(x, y, 1),
                "turn off" => lights.set(x, y, 0),
                "toggle" => {
                    let value = lights.get_mut(x, y);
                    *value = if *value == 0 { 1 } else { 0 };
                }
                _ => panic!("Unknown command: {cmd}"),
            };
        }
    }

    Some(lights.iter().sum())
}

/// See [2015/6](https://adventofcode.com/2015/day/6#part2)
pub fn part_two(input: &str) -> Option<u32> {
    let cmds = commands(input);
    let mut lights = Vec2D::new(0, 1000);

    for (cmd, start, end) in cmds {
        for (x, y) in points_within(start, end) {
            match cmd {
                // "turn on" => *lights.entry((x, y)).or_insert(0) += 1,
                "turn on" => *lights.get_mut(x, y) += 1,
                "turn off" => {
                    let light = lights.get_mut(x, y);
                    if *light > 0 {
                        *light -= 1;
                    }
                },
                "toggle" => {
                    *lights.get_mut(x, y) += 2;
                }
                _ => panic!("Unknown command: {cmd}"),
            }
        }
    }

    Some(lights.iter().sum())
}

fn main() {
    let input = &aoc::get_input(2015, 6);
    aoc::solve!(1, part_one, input);
    aoc::solve!(2, part_two, input);
}

#[cfg(test)]
mod tests_2015_6 {
    use super::*;

    #[test]
    fn test_examples() {
        assert_eq!(part_one("turn on 0,0 through 999,999"), Some(1_000_000));
        assert_eq!(part_one("toggle 0,0 through 999,0"), Some(1_000));
        assert_eq!(part_one("turn off 499,499 through 500,500"), Some(0));

        assert_eq!(part_two("turn on 0,0 through 0,0"), Some(1));
        assert_eq!(part_two("toggle 0,0 through 999,999"), Some(2_000_000));
    }
}
