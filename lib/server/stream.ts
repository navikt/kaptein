import { getResponse } from '@/lib/server/api';
import type { AppName } from '@/lib/server/get-obo-token';

interface WithTotal {
  readonly totalCount: number;
  /**
   * Percentage of total count that has been processed so far (from 0 to 100).
   * Only calculated when and if read.
   */
  readonly percentage: number;
}

interface WithoutTotal {
  readonly totalCount: null;
  readonly percentage: null;
}

interface BaseParsedLine<T> {
  readonly data: T;
  readonly count: number;
}

type ParsedLine<T> = BaseParsedLine<T> & Total;

type Total = WithTotal | WithoutTotal;

type ParserFn<T> = (line: string) => T;

/**
 * Fetches NDJSON data from the specified path and returns a ReadableStream of parsed objects.
 *
 * @template T - The type of objects to be parsed from the NDJSON stream.
 * @param {AppName} appName - The name of the application to fetch data for.
 * @param {string} path - The API endpoint path to fetch the NDJSON data from.
 * @returns {Promise<ReadableStream<T>>} A promise that resolves to a ReadableStream of parsed objects of type T.
 * @throws Will throw an error if the response body is null, or if the Content-Type or Transfer-Encoding headers are not as expected.
 */
export const streamData = async <T>(
  appName: AppName,
  path: string,
  parser: ParserFn<T> = JSON.parse,
): Promise<ReadableStream<ParsedLine<T>>> => {
  const res = await getResponse(appName, path);

  if (res.body === null) {
    throw new Error('Response body is null');
  }

  if (res.headers.get('Content-Type') !== 'application/x-ndjson') {
    throw new Error(`Expected Content-Type application/x-ndjson but received ${res.headers.get('Content-Type')}`);
  }

  if (res.headers.get('Transfer-Encoding') !== 'chunked') {
    throw new Error(`Expected Transfer-Encoding chunked but received ${res.headers.get('Transfer-Encoding')}`);
  }

  const totalCount = parseTotalCount(res.headers.get('Total-Count'));
  let count = 0;

  const reader = res.body.getReader();
  const textDecoder = new TextDecoder();
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
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.trim().length === 0) {
            continue;
          }

          try {
            count++;
            controller.enqueue(parseLine(line, count, totalCount, parser));
          } catch (e) {
            controller.error(new Error(`Failed to parse JSON: ${e instanceof Error ? e.message : 'Unknown error'}`));
          }
        }
      }

      // Process any remaining data in the buffer after the stream ends
      if (buffer.trim().length !== 0) {
        try {
          count++;
          controller.enqueue(parseLine(buffer, count, totalCount, parser));
        } catch (e) {
          controller.error(new Error(`Failed to parse JSON: ${e instanceof Error ? e.message : 'Unknown error'}`));
        }
      }

      controller.close();
    },
    cancel() {
      reader.cancel();
    },
  });

  return stream;
};

const parseLine = <T>(line: string, count: number, totalCount: number | null, parser: (line:string): T) => {
  if (totalCount === null) {
    return { data: JSON.parse(line), count, totalCount: null, percentage: null };
  }

  return {
    data: JSON.parse(line),
    count,
    totalCount,
    get percentage() {
      return (count / totalCount) * 100;
    },
  };
};

const parseTotalCount = (totalCountHeader: string | null): number | null => {
  if (totalCountHeader === null) {
    return null;
  }

  const totalCount = Number.parseInt(totalCountHeader, 10);

  if (Number.isNaN(totalCount)) {
    console.warn(`Invalid Total-Count header value: ${totalCountHeader}`);

    return null;
  }

  if (totalCount < 0) {
    console.warn(`Negative Total-Count header value: ${totalCountHeader}`);

    return null;
  }

  return totalCount;
};
