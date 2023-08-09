/*
 * This file contains template code.
 * There is no need to edit this file unless you want to change template functionality.
 */
use std::{
    fs::{create_dir_all, File, OpenOptions, metadata},
    io::Write,
    process,
};
use clap::Parser;

const MODULE_TEMPLATE: &str = r###"pub fn part_one(input: &str) -> Option<u32> {
    None
}

pub fn part_two(input: &str) -> Option<u32> {
    None
}

fn main() {
    let input = &aoc::read_input_file(YEAR, DAY);
    aoc::solve!(1, part_one, input);
    aoc::solve!(2, part_two, input);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part_one() {
        let input = aoc::read_input_file(YEAR, DAY);
        assert_eq!(part_one(&input), None);
    }

    #[test]
    fn test_part_two() {
        let input = aoc::read_input_file(YEAR, DAY);
        assert_eq!(part_two(&input), None);
    }
}
"###;

#[derive(clap::Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct CLIArgs {
    year: u16,
    day: u8,
}

fn safe_create_file(path: &str) -> Result<File, std::io::Error> {
    OpenOptions::new().write(true).create_new(true).open(path)
}

// fn create_file(path: &str) -> Result<File, std::io::Error> {
//     OpenOptions::new().write(true).create(true).open(path)
// }

fn main() {
    let args = CLIArgs::parse();

    let year = args.year.to_string();
    let day = args.day.to_string();

    // let input_path = format!("src/inputs/{day}.txt");
    // let example_path = format!("src/examples/{day}.txt");
    let year_dir = format!("src/years/{year}");
    let module_path = format!("src/years/{year}/day{day}.rs");

    if std::path::Path::new(&module_path).exists() {
        eprintln!("Module file already exists: \"{}\"", &module_path);
        process::exit(1);
    }

    create_dir_all(year_dir).unwrap();

    let mut file = match safe_create_file(&module_path) {
        Ok(file) => file,
        Err(e) => {
            eprintln!("Failed to create module file: {e}");
            process::exit(1);
        }
    };

    match file.write_all(MODULE_TEMPLATE.replace("DAY", &day.to_string()).as_bytes()) {
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
    println!(
        "🎄 Type `cargo solve {} {}` to run your solution.",
        &year, &day
    );
}
