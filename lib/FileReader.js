'use strict';

const { createReadStream } = require('fs');
const es = require('event-stream');
const Event = require('events')
module.exports = class FileReader {
  /**
   * @param {string} filename 
   * @param {string|RegExp} separator 
   */
  constructor(filename, separator = /[\n\r]+/) {
    this.event = new Event();
    this.reader = createReadStream(filename)
      // .pipe(iconv.decodeStream('utf8'));
      .pipe(es.split(separator))
      .pipe(
        es.mapSync(line => {
          this.reader.pause();
          this.lineNum++;
          this.event.emit('data', line);
        })
        .on('error', err => {
          this.event.emit('error', err);
          console.log('Error while reading file.', err);
        })
        .on('end', () => {
          this.event.emit('end');
          this.eof = true;
        })
      );
    this.reader.pause();
    this.lineNum = 0;
    this.eof = false;
  }

  /**
   * @param {string} file
   * @param {RegExp|string} separator
   * @returns {AsyncGenerator<string, void, unknown>}
   */
  static fileLines (file, separator = /[\n\r]+/) {
    const reader = new FileReader(file, separator);
    while (true) {
      const line = await reader.nextLine();
      if (!line) break;
      else yield line;
    }
  }

  /** @returns {Promise<null|string>} */
  nextLine () {
    return this.eof
      ? null
      : new Promise(resolve => {
        this.event.once('data', resolve);
        this.event.once('error', () => resolve(null));
        this.reader.resume();
      });
  }

  /** @returns {Promise<string[]>} */
  async allLines () {
    const lines = [];
    await new Promise(resolve => {
      this.event.on('data', lines.push.bind(lines));
      this.event.on('end', resolve);
      this.reader.resume();
    });
    this.event.removeAllListeners();
    return lines;
  }
}
