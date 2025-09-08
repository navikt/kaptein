import { getResponse } from '@/lib/server/api';
import type { AppName } from '@/lib/server/get-obo-token';

export type ParserFn<T> = (line: string) => T;

interface CheckEvent<T> {
  readonly data: T[];
  readonly count: number;
  readonly totalCount: number | null;
}

interface Result<T> {
  stream: ReadableStream<CheckEvent<T>>;
  totalCount: number | null;
}

/**
 * Fetches data from the specified path and returns a ReadableStream of parsed data.
 *
 * @template T - The type of objects to be parsed from the stream.
 * @param appName - The name of the application to fetch data for.
 * @param path - The API endpoint path to fetch the stream from.
 * @param parser - A function to parse each line of the stream into an object of type T. Defaults to JSON.parse.
 * @param contentType - The expected Content-Type of the response. Defaults to 'application/x-ndjson'.
 * @param separator - The entry separator used in the stream. Defaults to newline character.
 * @returns A promise that resolves to a ReadableStream of parsed objects of type T.
 * @throws Will throw an error if the response body is null, or if the Content-Type or Transfer-Encoding headers are not as expected.
 */
export const streamData = async <T>(
  appName: AppName,
  path: string,
  parser: ParserFn<T> = JSON.parse,
  contentType = 'application/x-ndjson',
  separator = '\n',
  batchSize = 100,
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

  if (totalCount === null && batchSize > 1) {
    throw new Error('Cannot combine batching with unknown total count');
  }

  const reader = res.body.getReader();
  const textDecoder = new TextDecoder(); // Defaults to 'utf-8'

  let count = 0;
  const batch: T[] = [];
  let buffer = '';

  const stream = new ReadableStream<CheckEvent<T>>({
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
        buffer = lines.pop() ?? ''; // Keep the last incomplete line, if any

        console.debug(`Received ${lines.length} lines`);

        for (const line of lines) {
          if (line.trim().length === 0) {
            continue;
          }

          try {
            count++;
            batch.push(parser(line));

            if (batch.length === batchSize || count === totalCount) {
              controller.enqueue({ data: batch, count, totalCount });
              batch.length = 0;
            }
          } catch (e) {
            console.error(line);
            controller.error(new Error(`Failed to parse line: ${e instanceof Error ? e.message : 'Unknown error'}`));
          }
        }
      }

      // Process any remaining data in the buffer
      if (buffer.trim().length !== 0) {
        const data = buffer.split(separator).map(parser);
        controller.enqueue({ data, count: count + data.length, totalCount });
      }

      controller.close();
    },
    cancel() {
      reader.cancel();
    },
  });

  return { stream, totalCount };
};

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
