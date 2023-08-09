/*
 * This file contains template code.
 * There is no need to edit this file unless you want to change template functionality.
 */
use aoc::{ANSI_BOLD, ANSI_ITALIC, ANSI_RESET};
use std::process::Command;

fn run(year: i32, day: i32) -> f64 {
    // let day = day.to_string();
    // let year = year.to_string();
    let day_year = format!("{year}-{day}");

    let mut args = vec!["run", "--bin", day_year.as_str()];
    if cfg!(not(debug_assertions)) {
        args.push("--release");
    }

    let cmd = Command::new("cargo").args(&args).output().unwrap();

    println!("----------");
    println!("{ANSI_BOLD}| Year {year} | Day {day} |{ANSI_RESET}");
    println!("----------");

    let output = String::from_utf8(cmd.stdout).unwrap();
    let is_empty = output.is_empty();

    println!(
        "{}",
        if is_empty {
            "Not solved."
        } else {
            output.trim()
        }
    );

    if is_empty {
        0_f64
    } else {
        aoc::parse_exec_time(&output)
    }
}

fn main() {
    let total: f64 = (1..=25)
        .flat_map(|day| (2015..=2022).map(move |year| [year, day]))
        .map(|[year, day]| run(year, day))
        .sum();

    println!("{ANSI_BOLD}Total:{ANSI_RESET} {ANSI_ITALIC}{total:.2}ms{ANSI_RESET}");
}
