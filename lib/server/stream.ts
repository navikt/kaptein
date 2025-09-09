import { isDeployed } from '@/lib/environment';
import { getLogger } from '@/lib/logger';
import { getUrl } from '@/lib/server/api';
import type { AppName } from '@/lib/server/get-obo-token';
import { getToken } from '@/lib/server/token';
import { generateTraceParent } from '@/lib/server/traceparent';

const log = getLogger('stream');

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
): Promise<Result<T>> => {
  const { traceparent, traceId, spanId } = generateTraceParent();

  log.debug(`Starting data stream from ${appName}${path}`, traceId, spanId);

  const headers = new Headers({
    accept: 'application/json',
    traceparent,
  });

  if (isDeployed) {
    const { access_token } = await getToken(traceId);

    headers.append('Authorization', `Bearer ${access_token}`);
  }

  const url = getUrl(appName) + path;
  const res = await fetch(url, { method: 'GET', headers });

  if (res.headers.get('Transfer-Encoding') !== 'chunked') {
    throw new Error(`Expected Transfer-Encoding chunked but received ${res.headers.get('Transfer-Encoding')}`);
  }

  if (res.headers.get('Content-Type') !== contentType) {
    throw new Error(`Expected Content-Type ${contentType} but received ${res.headers.get('Content-Type')}`);
  }

  if (res.body === null) {
    throw new Error('Response body is null');
  }

  const totalCount = parseTotalCount(res.headers.get('Kaptein-Total'), traceId, spanId);

  if (totalCount === null) {
    throw new Error('Invalid Kaptein-Total header');
  }

  const batchSize = Math.max(1, Math.floor(totalCount / 200)); // Aim for ~200 events (0.5% per event)

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

        log.debug(`Received ${lines.length} lines`, traceId, spanId);

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
            log.error(`Could not parse Kafka value: "${line}"`, traceId, spanId);
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

const parseTotalCount = (totalCountHeader: string | null, traceId: string, spanId: string): number | null => {
  if (totalCountHeader === null) {
    return null;
  }

  const totalCount = Number.parseInt(totalCountHeader, 10);

  if (Number.isNaN(totalCount)) {
    log.warn(`Invalid Kaptein-Total header value: ${totalCountHeader}`, traceId, spanId);

    return null;
  }

  if (totalCount < 0) {
    log.warn(`Negative Kaptein-Total header value: ${totalCountHeader}`, traceId, spanId);

    return null;
  }

  return totalCount;
};
