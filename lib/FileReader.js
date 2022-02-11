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
          console.log('Error while reading file.', err);
        })
        .on('end', () => {
          this.eof = true;
        })
      );
    this.reader.pause();
    this.lineNum = 0;
    this.eof = false;
  }

  /** @returns {Promise<null|string>} */
  nextLine () {
    return this.eof
      ? null
      : new Promise(resolve => {
        this.event.once('data', resolve);
        this.reader.resume();
      });
  }
}
