// Input: https://adventofcode.com/2015/day/2/input

struct Present {
    length: u32,
    width: u32,
    height: u32,
}

impl Present {
    pub fn from(str: &str) -> Present {
        let mut parts = str.split("x");
        let length = parts.next().unwrap().parse::<u32>().unwrap();
        let width = parts.next().unwrap().parse::<u32>().unwrap();
        let height = parts.next().unwrap().parse::<u32>().unwrap();
        Present {
            length,
            width,
            height,
        }
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
pub fn part_one(input: &str) -> Option<i64> {
    let p = Present {
        width: 1,
        length: 2,
        height: 3,
    };
    let a = p.area();
    None
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
        assert_eq!(Present::from("2x3x4").area(), 52);
        assert_eq!(Present::from("1x1x10").area(), 42);
        assert_eq!(Present::from("2x3x4").smallest_side_area(), 6);
        assert_eq!(Present::from("1x1x10").smallest_side_area(), 1);

        // let input = aoc::get_input(2015, 2);
        // assert_ne!(part_one(&input), None);
    }

    // #[test]
    // fn test_part_two() {
    //     let input = aoc::get_input(2015, 2);
    //     assert_ne!(part_two(&input), None);
    // }
}
