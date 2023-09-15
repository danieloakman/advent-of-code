/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
import { promises, existsSync, readFileSync } from 'fs';
const { writeFile, readFile } = promises;
import { connect } from 'puppeteer';
import { join } from 'path';
import { openChrome, tmpdir, limitConcurrentCalls, main, sleep } from './utils';
import { execSync } from 'child_process';

const SESSION_COOKIE_PATH = join(tmpdir(), 'sessionCookie.txt');
// let document: any;

// export async function downloadInput(year: number, day: number) {
//   const browser = await puppeteer.connect({
//     browserWSEndpoint: await openChrome(),
//   });
//   const page = (await browser.pages())[0];
//   page.on('console', message => {
//     if (!message.text().includes('ERR_BLOCKED_BY_CLIENT')) console.log(message.text());
//   });
//   await page.waitForNetworkIdle({ timeout: 10000 });

//   await page.goto(`https://adventofcode.com/${year}/day/${day}/input`, { waitUntil: 'networkidle0' });

//   // eslint-disable-next-line no-undef
//   const input = await page.evaluate(() => document.querySelector('pre').innerText);
//   await Promise.all([browser.close(), writeFile(join(__dirname, '../', `${year}/day${day}-input`), input.trim())]);
// }

async function getInput(year: string, day: string, sessionCookie: string): Promise<string> {
  const res = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
    headers: {
      Cookie: `session=${sessionCookie}`,
      // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    }
  });
  if (res.status === 200) return res.text();
  return '';
}

async function newSessionCookie() {
  if (!existsSync(SESSION_COOKIE_PATH)) await writeFile(SESSION_COOKIE_PATH, '');

  const browser = await connect({
    browserWSEndpoint: await openChrome(),
  });
  const page = (await browser.pages())[0];
  page.on('console', message => {
    if (!message.text().includes('ERR_BLOCKED_BY_CLIENT')) console.log(message.text());
  });
  await page.waitForNetworkIdle({ timeout: 10000 });

  await page.goto('https://adventofcode.com' /* , { waitUntil: 'networkidle0' } */);
  const cookies = await page.cookies();
  await browser.close();
  const sessionCookie = (cookies.find(c => c.name === 'session') || { value: '' }).value;
  if (!sessionCookie)
    throw new Error('No session cookie found. Probably because you are not logged into adventofcode.com on Chrome.');

  await writeFile(SESSION_COOKIE_PATH, sessionCookie);
  return sessionCookie;
}

export function inputPath(year: string, day: string) {
  return join(tmpdir(), `${year}-${day}-input.txt`);
}

/** Downloads the puzzle input for the given `year` and `day`. Limits to collecting only one download at a time. */
export const downloadInput = limitConcurrentCalls(async (year: string | number, day: string | number): Promise<string> => {
  year = year.toString();
  day = day.toString();

  const path = inputPath(year, day);
  if (existsSync(path)) return readFile(path, 'utf8').then(fileStr => fileStr.trimEnd()); // Return cached input

  let sessionCookie = await readFile(SESSION_COOKIE_PATH, 'utf-8').catch(() => newSessionCookie());

  let input = '';
  do {
    input = await getInput(year, day, sessionCookie);
    if (!input) sessionCookie = await newSessionCookie();
  } while (!input);
  input = input.trimEnd();
  await writeFile(path, input);

  return input;
}, 1);

export function downloadInputSync(year: string | number, day: string | number): string {
  year = year.toString();
  day = day.toString();

  const path = inputPath(year, day);
  if (existsSync(path)) return readFileSync(path, 'utf-8').trimEnd(); // Return cached input

  const input = execSync(`pnpm tsn ${__filename} --download "${year},${day}"`, { encoding: 'utf-8' });
  return input.trimEnd();
}

main(import.meta.path, async () => {
  if (process.argv.includes('--download')) {
    const [year, day] = process.argv[process.argv.indexOf('--download') + 1].split(',');
    const input = await downloadInput(year, day);
    console.log(input);
    sleep(1000);
  }
});
