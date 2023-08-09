/*
 * This file contains template code.
 * There is no need to edit this file unless you want to change template functionality.
 */
use std::{
    fs::{create_dir_all, File, OpenOptions, metadata},
    io::Write,
    process,
};

const MODULE_TEMPLATE: &str = r###"pub fn part_one(input: &str) -> Option<u32> {
    None
}

pub fn part_two(input: &str) -> Option<u32> {
    None
}

fn main() {
    let input = &aoc::read_input_file(DAY);
    aoc::solve!(1, part_one, input);
    aoc::solve!(2, part_two, input);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part_one() {
        let input = aoc::read_input_file("examples", DAY);
        assert_eq!(part_one(&input), None);
    }

    #[test]
    fn test_part_two() {
        let input = aoc::read_input_file("examples", DAY);
        assert_eq!(part_two(&input), None);
    }
}
"###;

const HELP: &str = "\
App

USAGE:
  app [OPTIONS] --number NUMBER [INPUT]

FLAGS:
  -h, --help            Prints help information

OPTIONS:
  --year NUMBER         The year to scaffold
  --day NUMBER          The day to scaffold
";

#[derive(Debug)]
struct CLIArgs {
    year: u16,
    day: u8,
}

fn parse_args() -> Result<CLIArgs, pico_args::Error> {
    let mut raw_args = pico_args::Arguments::from_env();

    // Help has a higher priority and should be handled separately.
    if raw_args.contains(["-h", "--help"]) {
        print!("{}", HELP);
        std::process::exit(0);
    }

    let args = CLIArgs {
        year: raw_args.value_from_str("--year")?,
        day: raw_args.value_from_str("--day")?,
        // input: pargs.free_from_str()?,
    };

    // It's up to the caller what to do with the remaining arguments.
    let remaining = raw_args.finish();
    if !remaining.is_empty() {
        eprintln!("Warning: unused arguments left: {:?}.", remaining);
    }

    Ok(args)
}

fn safe_create_file(path: &str) -> Result<File, std::io::Error> {
    OpenOptions::new().write(true).create_new(true).open(path)
}

// fn create_file(path: &str) -> Result<File, std::io::Error> {
//     OpenOptions::new().write(true).create(true).open(path)
// }

fn main() {
    let args = match parse_args() {
        Ok(args) => args,
        Err(_) => {
            eprintln!("Need to specify a day (as integer). example: `cargo scaffold 7`");
            process::exit(1);
        }
    };

    let year = args.year.to_string();
    let day = args.day.to_string();

    // let input_path = format!("src/inputs/{day}.txt");
    // let example_path = format!("src/examples/{day}.txt");
    let year_dir = format!("src/bin/{year}");
    let module_path = format!("src/bin/{year}/day{day}.rs");

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
