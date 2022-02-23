'use strict';

const { createReadStream, createWriteStream } = require('fs');
const es = require('event-stream');
const Event = require('events');

module.exports = class FileStream {
  /**
   * @param {string} fileName 
   * @param {string|RegExp} separator 
   */
  constructor(fileName, separator = /[\n\r]+/) {
    /** @readonly */
    this.lineNum = 0;
    /** @private */
    this.separator = separator;
    /** @private */
    this.fileName = fileName;
    this.event = new Event();
    /**
     * @private
     * @type {import('event-stream').MapStream}
     */
    this.reader = null;
    /** @private Private property. */
    this.writer = createWriteStream(fileName, { flags: 'a' });

    this.resetReader();
  }

  /**
   * @param {string} file
   * @param {RegExp|string} separator
   * @returns {AsyncGenerator<string, void, unknown>}
   */
  static async *fileLines (file, separator = /[\n\r]+/) {
    const reader = new FileStream(file, separator);
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
        this.event.once('data', data => {
          this.reader.pause();
          resolve(data);
        });
        this.event.once('error', () => resolve(null));
        this.reader.resume();
      });
  }

  /** @returns {Promise<string[]>} */
  async allLines () {
    const lines = [];
    await new Promise(resolve => {
      this.event.on('data', data => lines.push(data));
      this.event.on('error', _ => resolve());
      this.event.on('end', resolve);
      this.reader.resume();
    });
    this.event.removeAllListeners();
    return lines;
  }

  resetReader () {
    this.lineNum = 0;
    this.eof = false;
    this.reader = createReadStream(this.fileName)
      .pipe(es.split(this.separator))
      .pipe(
        es.mapSync(line => {
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
  }

  /**
   * @param {string} str
   * @returns {Promise<void>} void
   */
  write (str) {
    return new Promise(resolve => {
      this.writer.write(str, err => {
        if (err) {
          console.log('Error while writing file.', err);
          this.event.emit('error', err);
        }
        resolve();
      });
    });
  }
};

// (async () => {
//   const file = new (module.exports)('./test.txt');
//   await file.write('Hello\nWorld!\n');
//   // await file.write('something\n');
//   for (const line of (await file.allLines()))
//     console.log(line);
//   // while (!file.eof)
//   //   console.log(await file.nextLine());
// })();
