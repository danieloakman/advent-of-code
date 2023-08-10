/*
 * This file contains template code.
 * There is no need to edit this file unless you want to change template functionality.
 */
use clap::Parser;
use std::{
    fs::{File, OpenOptions},
    io::Write,
    process,
};

const MODULE_TEMPLATE: &str = r###"// Input: https://adventofcode.com/YEAR/day/DAY/input

/// See [YEAR/DAY](https://adventofcode.com/YEAR/day/DAY)
pub fn part_one(input: &str) -> Option<i64> {
    None
}

/// See [YEAR/DAY](https://adventofcode.com/YEAR/day/DAY#part2)
pub fn part_two(input: &str) -> Option<i64> {
    None
}

fn main() {
    let input = &aoc::get_input(YEAR, DAY);
    aoc::solve!(1, part_one, input);
    aoc::solve!(2, part_two, input);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part_one() {
        let input = aoc::get_input(YEAR, DAY);
        assert_ne!(part_one(&input), None);
    }

    #[test]
    fn test_part_two() {
        let input = aoc::get_input(YEAR, DAY);
        assert_ne!(part_two(&input), None);
    }
}
"###;

#[derive(clap::Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct CLIArgs {
    year_day: String,
}

fn safe_create_file(path: &str) -> Result<File, std::io::Error> {
    OpenOptions::new().write(true).create_new(true).open(path)
}

// fn create_file(path: &str) -> Result<File, std::io::Error> {
//     OpenOptions::new().write(true).create(true).open(path)
// }

fn main() {
    let args = CLIArgs::parse();

    // Split year and day from args.year_day:
    let dash_index = args
        .year_day
        .find('-')
        .expect("Invalid year and day format. Expected \"YYYY-DD\"");
    let (year, mut day) = args.year_day.split_at(dash_index);
    day = &day[1..]; // remove leading dash.

    let module_path = format!("src/bin/{year}-{day}.rs");

    if std::path::Path::new(&module_path).exists() {
        eprintln!("Module file already exists: \"{}\"", &module_path);
        process::exit(1);
    }

    let mut file = match safe_create_file(&module_path) {
        Ok(file) => file,
        Err(e) => {
            eprintln!("Failed to create module file: {e}");
            process::exit(1);
        }
    };

    match file.write_all(
        MODULE_TEMPLATE
            .replace("DAY", &day)
            .replace("YEAR", &year)
            .as_bytes(),
    ) {
        Ok(_) => {
            println!("Created module file \"{}\"", &module_path);
        }
        Err(e) => {
            eprintln!("Failed to write module contents: {e}");
            process::exit(1);
        }
    }

    // match create_file(&input_path) {
    //     Ok(_) => {
    //         println!("Created empty input file \"{}\"", &input_path);
    //     }
    //     Err(e) => {
    //         eprintln!("Failed to create input file: {e}");
    //         process::exit(1);
    //     }
    // }

    // match create_file(&example_path) {
    //     Ok(_) => {
    //         println!("Created empty example file \"{}\"", &example_path);
    //     }
    //     Err(e) => {
    //         eprintln!("Failed to create example file: {e}");
    //         process::exit(1);
    //     }
    // }

    println!("---");
    println!("🎄 Type `cargo solve {year}-{day}` to run your solution.",);
}
