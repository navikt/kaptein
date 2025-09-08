import { getResponse } from '@/lib/server/api';
import type { AppName } from '@/lib/server/get-obo-token';

export type ParserFn<T> = (line: string) => T;

interface ParsedLine<T> {
  readonly data: T;
  readonly count: number;
  readonly totalCount: number | null;
}

interface Result<T> {
  stream: ReadableStream<ParsedLine<T>>;
  totalCount: number | null;
}

/**
 * Fetches data from the specified path and returns a ReadableStream of parsed data.
 *
 * @template T - The type of objects to be parsed from the stream.
 * @param {AppName} appName - The name of the application to fetch data for.
 * @param {string} path - The API endpoint path to fetch the stream from.
 * @param {ParserFn<T>} [parser=JSON.parse] - A function to parse each line of the stream into an object of type T. Defaults to JSON.parse.
 * @param {string} [contentType='application/x-ndjson'] - The expected Content-Type of the response. Defaults to 'application/x-ndjson'.
 * @param {string} [separator='\n'] - The entry separator used in the stream. Defaults to newline character.
 * @returns {Promise<ReadableStream<T>>} A promise that resolves to a ReadableStream of parsed objects of type T.
 * @throws Will throw an error if the response body is null, or if the Content-Type or Transfer-Encoding headers are not as expected.
 */
export const streamData = async <T>(
  appName: AppName,
  path: string,
  parser: ParserFn<T> = JSON.parse,
  contentType = 'application/x-ndjson',
  separator = '\n',
): Promise<Result<T>> => {
  const res = await getResponse(appName, path);

  if (res.headers.get('Transfer-Encoding') !== 'chunked') {
    throw new Error(`Expected Transfer-Encoding chunked but received ${res.headers.get('Transfer-Encoding')}`);
  }

  if (res.headers.get('Content-Type') !== contentType) {
    throw new Error(`Expected Content-Type ${contentType} but received ${res.headers.get('Content-Type')}`);
  }

  if (res.body === null) {
    throw new Error('Response body is null');
  }

  const totalCount = parseTotalCount(res.headers.get('Kaptein-Total'));
  let count = 0;

  const reader = res.body.getReader();
  const textDecoder = new TextDecoder(); // Defaults to 'utf-8'
  let buffer = '';

  const stream = new ReadableStream<ParsedLine<T>>({
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
    async start(controller) {
      // Read the stream
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += textDecoder.decode(value, { stream: true });
        const lines = buffer.split(separator);
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.trim().length === 0) {
            continue;
          }

          try {
            count++;
            controller.enqueue(parseLine(line, parser, count, totalCount));
          } catch (e) {
            controller.error(new Error(`Failed to parse line: ${e instanceof Error ? e.message : 'Unknown error'}`));
          }
        }
      }

      // Process any remaining data in the buffer after the stream ends
      if (buffer.trim().length !== 0) {
        try {
          count++;
          controller.enqueue(parseLine(buffer, parser, count, totalCount));
        } catch (e) {
          controller.error(new Error(`Failed to parse line: ${e instanceof Error ? e.message : 'Unknown error'}`));
        }
      }

      controller.close();
    },
    cancel() {
      reader.cancel();
    },
  });

  return { stream, totalCount };
};

const parseLine = <T>(line: string, parser: ParserFn<T>, count: number, totalCount: number | null): ParsedLine<T> => ({
  data: parser(line),
  count,
  totalCount,
});

const parseTotalCount = (totalCountHeader: string | null): number | null => {
  if (totalCountHeader === null) {
    return null;
  }

  const totalCount = Number.parseInt(totalCountHeader, 10);

  if (Number.isNaN(totalCount)) {
    console.warn(`Invalid Kaptein-Total header value: ${totalCountHeader}`);

    return null;
  }

  if (totalCount < 0) {
    console.warn(`Negative Kaptein-Total header value: ${totalCountHeader}`);

    return null;
  }

  return totalCount;
};
