// use ferris_says::say; // from the previous step
use std::fs;
use std::path::{Path, PathBuf};

fn input_path(year: u16, day: u16) -> PathBuf {
    return Path::new("tmp").join(format!("{}-{}-input", year, day));
}

fn main() {
    let path = input_path(2015, 1);
    // println!("In file {}", path.to_str().unwrap());
    let contents = fs::read_to_string(path).unwrap();
    // println!("With text: {}", contents);
    let mut floor: i16 = 0;
    let mut first_basement: u16 = 0;
    let mut char_num: u16 = 0;
    for c in contents.chars() {
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

    println!("Floor: {}", floor);
    println!("First basement: {}", first_basement);
}
