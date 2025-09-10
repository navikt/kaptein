import type { NextRequest } from 'next/server';
import { filterBehandlinger } from '@/app/api/graphs/filter-behandlinger';
import { parseParams } from '@/app/api/graphs/parse-params';
import { getData } from '@/components/behandlinger/saker-per-ytelse-og-sakstype/data';
import { InternalServerError, UnauthorizedError } from '@/lib/errors';
import { getLogger } from '@/lib/logger';
import { getSakstyperWithoutAnkeITR, getYtelser } from '@/lib/server/api';
import { BEHANDLINGER_DATA_LOADER } from '@/lib/server/behandlinger';
import type { DataListener } from '@/lib/server/data-loader';
import { generateSpanId, generateTraceId } from '@/lib/server/traceparent';
import type { Behandling } from '@/lib/server/types';

const log = getLogger('graphs-saker-per-ytelse-og-sakstype');

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const params = parseParams(request.nextUrl.searchParams);
  const traceId = generateTraceId();
  const spanId = generateSpanId();

  try {
    const ytelser = await getYtelser();
    const sakstyper = await getSakstyperWithoutAnkeITR();
    const initialBehandlinger = BEHANDLINGER_DATA_LOADER.getData();

    const textEncoder = new TextEncoder();

    let listener: DataListener<Behandling> | null = null;

    const eventStream = new ReadableStream({
      start(controller) {
        listener = (behandlinger) => {
          const { withTildelteFilter } = filterBehandlinger(behandlinger, params);

          const data = getData(withTildelteFilter, ytelser, sakstyper);

          const json = JSON.stringify(data);
          controller.enqueue(textEncoder.encode(`event: graph\ndata: ${json}\n\n`));
        };

        listener(initialBehandlinger);

        BEHANDLINGER_DATA_LOADER.addDataListener(listener);
      },
      cancel() {
        if (listener !== null) {
          BEHANDLINGER_DATA_LOADER.removeDataListener(listener);
        }

        log.debug('Stream cancelled by client', traceId, spanId);
      },
    });

    return new Response(eventStream, {
      headers: {
        'content-type': 'text/event-stream',
        'cache-control': 'no-cache',
        connection: 'keep-alive',
      },
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return new Response(error.message, { status: 401 });
    }

    if (error instanceof InternalServerError) {
      return new Response(error.message, { status: 500 });
    }

    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }

    return new Response('Ukjent feil', { status: 500 });
  }
}

const GRAPH_DATA_LOADERS: Record<string, () => string> = {};
