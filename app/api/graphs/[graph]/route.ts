import { createHash } from 'node:crypto';
import { notFound } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { filterBehandlinger } from '@/app/api/graphs/filter-behandlinger';
import { parseFilters } from '@/app/api/graphs/parse-params';
import { getAlderPerYtelseState } from '@/components/behandlinger/alder-per-ytelse/data';
import { getSakerPerYtelseOgSakstypeState } from '@/components/behandlinger/saker-per-ytelse-og-sakstype/data';
import { InternalServerError, UnauthorizedError } from '@/lib/errors';
import { GRAPH_DATA_EVENT_NAME, Graph, isGraphName } from '@/lib/graphs';
import { getLogger } from '@/lib/logger';
import { getSakstyperWithoutAnkeITR, getYtelser } from '@/lib/server/api';
import { BEHANDLINGER_DATA_LOADER } from '@/lib/server/behandlinger';
import type { DataListener } from '@/lib/server/data-loader';
import { generateSpanId, generateTraceId } from '@/lib/server/traceparent';
import type { Behandling, IKodeverkSimpleValue, IYtelse, Sakstype } from '@/lib/server/types';

export const dynamic = 'force-dynamic';

interface Params {
  graph: string;
}

interface Context {
  params: Promise<Params>;
}

export async function GET(request: NextRequest, { params }: Context) {
  const graphName = (await params).graph;
  const log = getLogger(`graphs-${graphName}`);
  const { searchParams } = request.nextUrl;
  const filters = parseFilters(searchParams);
  const traceId = generateTraceId();
  const spanId = generateSpanId();

  if (!isGraphName(graphName)) {
    return notFound();
  }

  const getData = GRAPH_DATA_LOADERS[graphName];

  try {
    const ytelser = await getYtelser();
    const sakstyper = await getSakstyperWithoutAnkeITR();
    const initialBehandlinger = BEHANDLINGER_DATA_LOADER.getData();

    const textEncoder = new TextEncoder();

    let listener: DataListener<Behandling> | null = null;

    const eventStream = new ReadableStream({
      start(controller) {
        listener = (behandlinger) => {
          const { withTildelteFilter } = filterBehandlinger(behandlinger, filters);

          const json = getData(withTildelteFilter, ytelser, sakstyper, searchParams);
          controller.enqueue(
            textEncoder.encode(`event: ${GRAPH_DATA_EVENT_NAME}\nid: ${hash(json)}\ndata: ${json}\n\n`),
          );
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

const GRAPH_DATA_LOADERS: Record<
  Graph,
  (
    behandlinger: Behandling[],
    ytelser: IYtelse[],
    sakstyper: IKodeverkSimpleValue<Sakstype>[],
    searchParams: URLSearchParams,
  ) => string
> = {
  [Graph.SAKER_PER_YTELSE_OG_SAKSTYPE]: (behandlinger, ytelser, sakstyper) =>
    JSON.stringify(getSakerPerYtelseOgSakstypeState(behandlinger, ytelser, sakstyper)),

  [Graph.ALDER_PER_YTELSE]: (behandlinger, ytelser, _sakstyper, searchParams) =>
    JSON.stringify(getAlderPerYtelseState(behandlinger, ytelser, searchParams)),
};

const hash = (input: string, length = 8): string =>
  createHash('sha256').update(input).digest('hex').substring(0, length);
