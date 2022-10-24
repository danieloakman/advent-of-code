/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
'use strict';

import { promises, existsSync } from 'fs';
const { writeFile, readFile } = promises;
import * as puppeteer from 'puppeteer';
import { join } from 'path';
import { openChrome } from './utils';
import * as https from 'https';

const SESSION_COOKIE_PATH = join(__dirname, '../sessionCookie.txt');
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

  const browser = await puppeteer.connect({
    browserWSEndpoint: await openChrome(),
  });
  const page = (await browser.pages())[0];
  page.on('console', message => {
    if (!message.text().includes('ERR_BLOCKED_BY_CLIENT')) console.log(message.text());
  });
  await page.waitForNetworkIdle({ timeout: 10000 });

  await page.goto('https://adventofcode.com', { waitUntil: 'networkidle0' });
  const cookies = await page.cookies();
  await browser.close();
  const sessionCookie = (cookies.find(c => c.name === 'session') || { value: '' }).value;
  if (!sessionCookie)
    throw new Error('No session cookie found. Probably because you are not logged into adventofcode.com on Chrome.');

  await writeFile(SESSION_COOKIE_PATH, sessionCookie);
  return sessionCookie;
}

export async function downloadInput(year: string, day: string) {
  let sessionCookie = await readFile(SESSION_COOKIE_PATH, 'utf-8').catch(() => newSessionCookie());

  let input = '';
  do {
    input = await getInput(year, day, sessionCookie);
    if (!input) sessionCookie = await newSessionCookie();
  } while (!input);
  await writeFile(join(__dirname, '../', `${year}/day${day}-input`), input);
}
