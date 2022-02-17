'use strict';

const { promises: { writeFile } } = require('fs');
const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const { join } = require('path');
// const https = require('https');
// module.exports.download = async function download (url, dest) {
//   return new Promise(resolve => {
//     https.get(url, res => {
//       res.on('data', resolve);
//     });
//   });
// };
// (async () => {
//   const a = await module.exports.download('https://adventofcode.com/2021/day/25/input', 'google.html');
//   let b;
// })();

function openChrome () {
  return new Promise((resolve, reject) => {
    const chrome = spawn(
      'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
      [
        '--remote-debugging-port=9222'
      ]
    );
    function onData (data) {
      data = data.toString();
      if (/listening on .+/.test(data)) {
        resolve(data.match(/ws.+/)[0]);
      } else if (/error/.test(data)) {
        reject(data.stack || data);
      }
    }
    chrome.stdout.on('data', onData);
    chrome.on('message', onData);
    chrome.stderr.on('data', onData);
    chrome.on('error', onData);
  });
}

/**
 * @param {number} year
 * @param {number} day
 */
module.exports.downloadInput = async function downloadInput (year, day) {
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

  const input = await page.evaluate(() => document.querySelector('pre').innerHTML);
  await Promise.all([
    browser.close(),
    writeFile(join(__dirname, '../', `${year}/day${day}-input`, ), input.trim())
  ]);
};
