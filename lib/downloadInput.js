'use strict';

const { promises: { writeFile, readFile } } = require('fs');
const puppeteer = require('puppeteer');
const { join } = require('path');
const { openChrome } = require('./utils');
const https = require('https');

const SESSION_COOKIE_PATH = join(__dirname, '../sessionCookie.txt');

module.exports.downloadInputOld = async function downloadInput (year, day) {
  const browser = await puppeteer.connect({
    browserWSEndpoint: await openChrome()
  });
  const page = (await browser.pages())[0];
  page.on('console', message => {
    if (!message.text().includes('ERR_BLOCKED_BY_CLIENT'))
      console.log(message.text());
  });
  await page.waitForNetworkIdle({ timeout: 10000 });

  await page.goto(`https://adventofcode.com/${year}/day/${day}/input`, { waitUntil: 'networkidle0' });

  const input = await page.evaluate(() => document.querySelector('pre').innerText);
  await Promise.all([
    browser.close(),
    writeFile(join(__dirname, '../', `${year}/day${day}-input`, ), input.trim())
  ]);
};

function getInput (year, day, sessionCookie) {
  return new Promise(resolve => {
    https.get(
      `https://adventofcode.com/${year}/day/${day}/input`,
      {
        headers: {
          'Cookie': `session=${sessionCookie}`
        }
      },
      res => {
        res.setEncoding('utf8');
        let body = '';
        res.on('data', data => body += data);
        res.on('end', () =>
          resolve(
            body.includes('Puzzle inputs differ by user.  Please log in to get your puzzle input')
              ? ''
              : body.trim())
        );
      }
    );
  });
}
async function newSessionCookie () {
  const browser = await puppeteer.connect({
    browserWSEndpoint: await openChrome()
  });
  const page = (await browser.pages())[0];
  page.on('console', message => {
    if (!message.text().includes('ERR_BLOCKED_BY_CLIENT'))
      console.log(message.text());
  });
  await page.waitForNetworkIdle({ timeout: 10000 });

  await page.goto(`https://adventofcode.com`, { waitUntil: 'networkidle0' });
  const cookies = await page.cookies();
  const sessionCookie = cookies.find(c => c.name === 'session').value;
  await writeFile(SESSION_COOKIE_PATH, sessionCookie);
  return sessionCookie;
}

module.exports.downloadInput = async function downloadInput (year, day) {
  let sessionCookie = await readFile(SESSION_COOKIE_PATH, 'utf-8')
    .catch(() => newSessionCookie());

  let input = '';
  do {
    input = await getInput(year, day, sessionCookie);
    if (!input)
      sessionCookie = await newSessionCookie();
  } while (!input);
  await writeFile(join(__dirname, '../', `${year}/day${day}-input`, ), input);
};
(async () => {
  const a = await module.exports.downloadInput(2018, 3);
  let b;
})();
