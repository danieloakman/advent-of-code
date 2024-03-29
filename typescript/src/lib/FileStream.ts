import { createReadStream, createWriteStream, WriteStream } from 'fs';
import { MapStream, split, mapSync } from 'event-stream';
import Event from 'events';

export class FileStream {
  public lineNum: number;
  private eof = false;
  private separator: string | RegExp;
  private fileName: string;
  private event: Event;
  private reader: MapStream | null = null;
  private writer: WriteStream;

  constructor(fileName: string, separator: string | RegExp = /[\n\r]+/) {
    this.lineNum = 0;
    this.separator = separator;
    this.fileName = fileName;
    this.event = new Event();
    this.writer = createWriteStream(fileName, { flags: 'a' });

    this.resetReader();
  }

  /**
   * @param {string} file
   * @param {RegExp|string} separator
   * @returns {AsyncGenerator<string, void, unknown>}
   */
  static async *fileLines(file: string, separator: RegExp | string = /[\n\r]+/): AsyncGenerator<string, void, unknown> {
    const reader = new FileStream(file, separator);
    while (true) {
      const line = await reader.nextLine();
      if (!line) break;
      else yield line;
    }
  }

  async nextLine(): Promise<null | string> {
    return this.eof
      ? null
      : new Promise(resolve => {
        this.event.once('data', data => {
          this.reader?.pause();
          resolve(data);
        });
        this.event.once('error', () => resolve(null));
        this.reader?.resume();
      });
  }

  async allLines(): Promise<string[]> {
    const lines: string[] = [];
    await new Promise(resolve => {
      this.event.on('data', data => lines.push(data));
      this.event.on('error', _ => resolve(undefined));
      this.event.on('end', resolve);
      this.reader?.resume();
    });
    this.event.removeAllListeners();
    return lines;
  }

  resetReader() {
    this.lineNum = 0;
    this.eof = false;
    this.reader = createReadStream(this.fileName)
      .pipe(split(this.separator))
      .pipe(
        mapSync((line: string) => {
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
          }),
      );
    this.reader.pause();
  }

  write(str: string): Promise<void> {
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
}

// (async () => {
//   const file = new (module.exports)('./test.txt');
//   await file.write('Hello\nWorld!\n');
//   // await file.write('something\n');
//   for (const line of (await file.allLines()))
//     console.log(line);
//   // while (!file.eof)
//   //   console.log(await file.nextLine());
// })();
