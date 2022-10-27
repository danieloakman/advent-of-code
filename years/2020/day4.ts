import { readFileSync } from 'fs';
import { join } from 'path';
const passports = readFileSync(join(__dirname, 'day4-input'), { encoding: 'utf-8' })
  .split(/\s\s\s/)
  .filter(v => v)
  .map(v => {
    const map = {};
    for (const keyValue of v
      .split(/\s+/)
      .filter(v => v)
      .map(v => v.split(':'))) {
      map[keyValue[0]] = keyValue[1];
    }
    return map;
  });

// Gold Star:
let valid = 0;
const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid' /* , 'cid' */];
for (const passport of passports) {
  if (requiredFields.every(field => field in passport)) valid++;
}
console.log({ valid });

// Silver Star:
valid = 0;
for (const { byr, iyr, eyr, hgt, hcl, ecl, pid /* , cid */ } of passports) {
  if (
    // Validate birth year:
    byr &&
    byr.length === 4 &&
    byr >= 1920 &&
    byr <= 2002 &&
    // Validate issue year:
    iyr &&
    iyr.length === 4 &&
    iyr >= 2010 &&
    iyr <= 2020 &&
    // Validate expiration date:
    eyr &&
    eyr.length === 4 &&
    eyr >= 2020 &&
    eyr <= 2030 &&
    // Validate height:
    /\d(cm|in)/.test(hgt) &&
    ((hgt.includes('cm') &&
      (() => {
        const num = hgt.match(/\d+/);
        return num >= 150 && num <= 193;
      })()) ||
      (hgt.includes('in') &&
        (() => {
          const num = hgt.match(/\d+/);
          return num >= 59 && num <= 76;
        })())) &&
    // Validate hair colour:
    /#[0-9a-f]{6}/.test(hcl) &&
    // Validate eye colour:
    ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(ecl) &&
    // Validate passport ID:
    pid &&
    pid.length === 9
  )
    valid++;
}
console.log({ valid });
