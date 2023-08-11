// Input: https://adventofcode.com/2015/day/2/input

use std::num::ParseIntError;

struct Present {
    length: u32,
    width: u32,
    height: u32,
}

// fn parse_u32(s: &str) -> u32 {
//     s.parse::<u32>()
//         .or_else(|_| Ok::<u32, u32>(0u32))
//         .expect(format!("Could not parse \"{s}\" as u32").as_str())
// }

impl Present {
    pub fn from(str: &str) -> Result<Present, ParseIntError> {
        let mut parts = str.split("x");
        Ok(Present {
            length: parts.next().unwrap().parse()?,
            width: parts.next().unwrap().parse()?,
            height: parts.next().unwrap().parse()?,
        })
    }

    fn area(&self) -> u32 {
        2 * self.length * self.width + 2 * self.width * self.height + 2 * self.height * self.length
    }

    fn ribbon_length(&self) -> u32 {
        self.smallest_side_area() + self.volume()
    }

    fn volume(&self) -> u32 {
        self.length * self.width * self.height
    }

    fn smallest_perimeter(&self) -> u32 {
        let mut vec = vec![self.length, self.width, self.height];
        vec.sort();
        let a = vec[0];
        let b = vec[1];
        a + a + b + b
    }

    fn smallest_side_area(&self) -> u32 {
        vec![
            self.length * self.width,
            self.width * self.height,
            self.height * self.length,
        ]
        .iter()
        .min()
        .unwrap()
        .clone()
    }
}

/// See [2015/2](https://adventofcode.com/2015/day/2)
pub fn part_one(input: &str) -> Option<u32> {
    Some(
        input
            .split("\n")
            .filter(|s| s.len() > 0)
            .map(|s| Present::from(s).expect(format!("Could not parse \"{s}\"").as_str()))
            .map(|p| p.area() + p.smallest_side_area())
            .sum(),
    )
}

/// See [2015/2](https://adventofcode.com/2015/day/2#part2)
pub fn part_two(input: &str) -> Option<i64> {
    None
}

fn main() {
    let input = &aoc::get_input(2015, 2);
    aoc::solve!(1, part_one, input);
    aoc::solve!(2, part_two, input);
}

#[cfg(test)]
mod tests_2015_2 {
    use super::*;

    #[test]
    fn test_part_one() {
        assert_eq!(Present::from("2x3x4").unwrap().area(), 52);
        assert_eq!(Present::from("1x1x10").unwrap().area(), 42);
        assert_eq!(Present::from("2x3x4").unwrap().smallest_side_area(), 6);
        assert_eq!(Present::from("1x1x10").unwrap().smallest_side_area(), 1);

        let input = aoc::get_input(2015, 2);
        let mut split = input.split("\n").filter(|s| s.len() > 0);
        let p = Present::from(split.next().unwrap()).unwrap();
        assert!(p.area() > 0);

        split
            .map(Present::from)
            .for_each(|p| assert!(p.unwrap().area() > 0));
        // let input = aoc::get_input(2015, 2);
        // assert_ne!(part_one(&input), None);
    }

    // #[test]
    // fn test_part_two() {
    //     let input = aoc::get_input(2015, 2);
    //     assert_ne!(part_two(&input), None);
    // }
}
