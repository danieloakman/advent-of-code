use std::fs::create_dir_all;
use std::io::Read;

use memoize::memoize;

pub mod helpers;

pub const ANSI_ITALIC: &str = "\x1b[3m";
pub const ANSI_BOLD: &str = "\x1b[1m";
pub const ANSI_RESET: &str = "\x1b[0m";

#[macro_export]
macro_rules! solve {
    ($part:expr, $solver:ident, $input:expr) => {{
        use aoc::{ANSI_BOLD, ANSI_ITALIC, ANSI_RESET};
        use std::fmt::Display;
        use std::time::Instant;

        fn print_result<T: Display>(func: impl FnOnce(&str) -> Option<T>, input: &str) {
            let timer = Instant::now();
            let result = func(input);
            let elapsed = timer.elapsed();
            match result {
                Some(result) => {
                    println!(
                        "{} {}(elapsed: {:.2?}){}",
                        result, ANSI_ITALIC, elapsed, ANSI_RESET
                    );
                }
                None => {
                    println!("not solved.")
                }
            }
        }

        println!("🎄 {}Part {}{} 🎄", ANSI_BOLD, $part, ANSI_RESET);
        print_result($solver, $input);
    }};
}

// pub fn read_input_file(year: u16, day: u8) -> String {
//     let path = input_path(year, day);
//     fs::read_to_string(path)
//         .expect(format!("Could not open input file for year {} day {}", year, day).as_str())
// }

fn parse_time(val: &str, postfix: &str) -> f64 {
    val.split(postfix).next().unwrap().parse().unwrap()
}

pub fn parse_exec_time(output: &str) -> f64 {
    output.lines().fold(0_f64, |acc, l| {
        if !l.contains("elapsed:") {
            acc
        } else {
            let timing = l.split("(elapsed: ").last().unwrap();
            // use `contains` istd. of `ends_with`: string may contain ANSI escape sequences.
            // for possible time formats, see: https://github.com/rust-lang/rust/blob/1.64.0/library/core/src/time.rs#L1176-L1200
            if timing.contains("ns)") {
                acc // range below rounding precision.
            } else if timing.contains("µs)") {
                acc + parse_time(timing, "µs") / 1000_f64
            } else if timing.contains("ms)") {
                acc + parse_time(timing, "ms")
            } else if timing.contains("s)") {
                acc + parse_time(timing, "s") * 1000_f64
            } else {
                acc
            }
        }
    })
}

/// copied from: https://github.com/rust-lang/rust/blob/1.64.0/library/std/src/macros.rs#L328-L333
#[cfg(test)]
macro_rules! assert_approx_eq {
    ($a:expr, $b:expr) => {{
        let (a, b) = (&$a, &$b);
        assert!(
            (*a - *b).abs() < 1.0e-6,
            "{} is not approximately equal to {}",
            *a,
            *b
        );
    }};
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_exec_time() {
        assert_approx_eq!(
            parse_exec_time(&format!(
                "🎄 Part 1 🎄\n0 (elapsed: 74.13ns){}\n🎄 Part 2 🎄\n0 (elapsed: 50.00ns){}",
                ANSI_RESET, ANSI_RESET
            )),
            0_f64
        );

        assert_approx_eq!(
            parse_exec_time("🎄 Part 1 🎄\n0 (elapsed: 755µs)\n🎄 Part 2 🎄\n0 (elapsed: 700µs)"),
            1.455_f64
        );

        assert_approx_eq!(
            parse_exec_time("🎄 Part 1 🎄\n0 (elapsed: 70µs)\n🎄 Part 2 🎄\n0 (elapsed: 1.45ms)"),
            1.52_f64
        );

        assert_approx_eq!(
            parse_exec_time(
                "🎄 Part 1 🎄\n0 (elapsed: 10.3s)\n🎄 Part 2 🎄\n0 (elapsed: 100.50ms)"
            ),
            10400.50_f64
        );
    }
}

/* pub mod aoc_cli {
    use std::{
        fmt::Display,
        fs::create_dir_all,
        process::{Command, Output, Stdio},
    };

    pub enum AocCliError {
        CommandNotFound,
        CommandNotCallable,
        BadExitStatus(Output),
        IoError,
    }

    impl Display for AocCliError {
        fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
            match self {
                AocCliError::CommandNotFound => write!(f, "aoc-cli is not present in environment."),
                AocCliError::CommandNotCallable => write!(f, "aoc-cli could not be called."),
                AocCliError::BadExitStatus(_) => {
                    write!(f, "aoc-cli exited with a non-zero status.")
                }
                AocCliError::IoError => write!(f, "could not write output files to file system."),
            }
        }
    }

    pub fn check() -> Result<(), AocCliError> {
        Command::new("aoc")
            .arg("-V")
            .output()
            .map_err(|_| AocCliError::CommandNotFound)?;
        Ok(())
    }

    pub fn read(day: u8, year: Option<u16>) -> Result<Output, AocCliError> {
        // TODO: output local puzzle if present.
        let args = build_args("read", &[], day, year);
        call_aoc_cli(&args)
    }

    pub fn download(day: u8, year: Option<u16>) -> Result<Output, AocCliError> {
        let input_path = get_input_path(day);

        let puzzle_path = get_puzzle_path(day);
        create_dir_all("src/puzzles").map_err(|_| AocCliError::IoError)?;

        let args = build_args(
            "download",
            &[
                "--overwrite".into(),
                "--input-file".into(),
                input_path.to_string(),
                "--puzzle-file".into(),
                puzzle_path.to_string(),
            ],
            day,
            year,
        );

        let output = call_aoc_cli(&args)?;

        if output.status.success() {
            println!("---");
            println!("🎄 Successfully wrote input to \"{}\".", &input_path);
            println!("🎄 Successfully wrote puzzle to \"{}\".", &puzzle_path);
            Ok(output)
        } else {
            Err(AocCliError::BadExitStatus(output))
        }
    }

    fn get_input_path(day: u8) -> String {
        let day_padded = format!("{day:02}");
        format!("src/inputs/{day_padded}.txt")
    }

    fn get_puzzle_path(day: u8) -> String {
        let day_padded = format!("{day:02}");
        format!("src/puzzles/{day_padded}.md")
    }

    fn build_args(command: &str, args: &[String], day: u8, year: Option<u16>) -> Vec<String> {
        let mut cmd_args = args.to_vec();

        if let Some(year) = year {
            cmd_args.push("--year".into());
            cmd_args.push(year.to_string());
        }

        cmd_args.append(&mut vec!["--day".into(), day.to_string(), command.into()]);

        cmd_args
    }

    fn call_aoc_cli(args: &[String]) -> Result<Output, AocCliError> {
        if cfg!(debug_assertions) {
            println!("Calling >aoc with: {}", args.join(" "));
        }

        Command::new("aoc")
            .args(args)
            .stdout(Stdio::inherit())
            .stderr(Stdio::inherit())
            .output()
            .map_err(|_| AocCliError::CommandNotCallable)
    }
} */

#[memoize]
pub fn input_path(year: u16, day: u8) -> std::path::PathBuf {
    let input_dir = std::env::current_dir()
        .map(|mut p| {
            p = p.join("../tmp").canonicalize().unwrap();
            p
        })
        .unwrap();

    create_dir_all(&input_dir).unwrap();

    input_dir.join(format!("{year}-{day}-input.txt"))
}

#[memoize]
pub fn get_input(year: u16, day: u8) -> String {
    let input_path = input_path(year, day);

    // If input file already exists, return it:
    if input_path.exists() {
        return std::fs::read_to_string(input_path).unwrap();
    }

    let mut session_cookie_path = input_path.clone();
    session_cookie_path.pop();
    session_cookie_path.push("sessionCookie.txt");

    let session_cookie =
        std::fs::read_to_string(session_cookie_path).expect("Could not read sessionCookie.txt");

    let client = reqwest::blocking::Client::new();
    let mut res = client
        .get(format!("https://adventofcode.com/{year}/day/{day}/input"))
        .header("Cookie", format!("session={session_cookie}"))
        .send()
        .unwrap();

    let mut body = String::new();
    res.read_to_string(&mut body)
        .expect("Could not read response body.");
    body = body.trim().to_string();

    // Write response body to file:
    std::fs::write(input_path, &body).unwrap();

    body
}
