import { InternalServerError, UnauthorizedError } from '@/lib/errors';
import { getLogger } from '@/lib/logger';
import { BEHANDLINGER_DATA_LOADER } from '@/lib/server/behandlinger';
import { generateSpanId, generateTraceId } from '@/lib/server/traceparent';

const log = getLogger('behandlinger-stream-route');

export const dynamic = 'force-dynamic';

export async function GET() {
  const traceId = generateTraceId();
  const spanId = generateSpanId();

  try {
    const textEncoder = new TextEncoder();

    const eventStream = new ReadableStream({
      start(controller) {
        const behandlinger = BEHANDLINGER_DATA_LOADER.getData();

        for (const behandling of behandlinger) {
          const json = JSON.stringify(behandling);
          controller.enqueue(textEncoder.encode(`${json}\n`));
        }

        controller.close();
      },
      cancel() {
        log.debug('Stream cancelled', traceId, spanId);
      },
    });

    return new Response(eventStream, {
      headers: {
        'Content-Type': 'application/x-ndjson',
        'Transfer-Endoding': 'chunked',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return new Response(error.message, { status: 401 });
    }

    if (error instanceof InternalServerError) {
      return new Response(error.message, { status: 500 });
    }

    return new Response('Ukjent feil', { status: 500 });
  }
}
