/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
import { promises, existsSync, readFileSync } from 'fs';
const { writeFile, readFile } = promises;
import { connect } from 'puppeteer';
import { join } from 'path';
import { openChrome, tmpdir, limitConcurrentCalls } from './utils';
import * as https from 'https';
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

function getInput(year: string, day: string, sessionCookie: string): Promise<string> {
  return new Promise(resolve => {
    https.get(
      `https://adventofcode.com/${year}/day/${day}/input`,
      {
        headers: {
          'Cookie': `session=${sessionCookie}`,
        },
      },
      res => {
        res.setEncoding('utf8');
        let body = '';
        res.on('data', data => (body += data));
        res.on('end', () =>
          resolve(
            body.includes('Puzzle inputs differ by user.  Please log in to get your puzzle input') ? '' : body.trim(),
          ),
        );
      },
    );
  });
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

function inputPath(year: string, day: string) {
  return join(tmpdir(), `${year}-${day}-input`);
}

/** Downloads the puzzle input for the given `year` and `day`. Limits to collecting only one download at a time. */
export const downloadInput = limitConcurrentCalls(async (year: string, day: string): Promise<string> => {
  const path = inputPath(year, day);
  if (existsSync(path)) return readFile(path, 'utf8'); // Return cached input

  let sessionCookie = await readFile(SESSION_COOKIE_PATH, 'utf-8').catch(() => newSessionCookie());

  let input = '';
  do {
    input = await getInput(year, day, sessionCookie);
    if (!input) sessionCookie = await newSessionCookie();
  } while (!input);
  await writeFile(path, input);

  return input;
}, 1);

export function downloadInputSync(year: string, day: string): string {
  const path = inputPath(year, day);
  if (existsSync(path)) return readFileSync(path, 'utf-8');

  return execSync(`node ${__filename} --download "${year},${day}"`, { encoding: 'utf-8' });
}

if (process.argv.includes('--download')) {
  const [year, day] = process.argv[process.argv.indexOf('--download') + 1].split(',');
  downloadInput(year, day).then(console.log);
}
