import { createHash } from 'node:crypto';
import { notFound } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { filterBehandlinger } from '@/app/api/graphs/filter-behandlinger';
import { parseFilters } from '@/app/api/graphs/parse-params';
import { getAlderState } from '@/components/graphs/alder/data';
import { getAlderPerYtelseState } from '@/components/graphs/alder-per-ytelse/data';
import { getFristIKabalState } from '@/components/graphs/frist-i-kabal/data';
import { getFristIKabalPerYtelseState } from '@/components/graphs/frist-i-kabal-per-ytelse/data';
import { getFristPerYtelseState } from '@/components/graphs/frist-per-ytelse/data';
import { getLedigeVsTildelteState } from '@/components/graphs/ledige-vs-tildelte/data';
import { getSakerPerSakstypeState } from '@/components/graphs/saker-per-sakstype/data';
import { getSakerPerYtelseOgSakstypeState } from '@/components/graphs/saker-per-ytelse-og-sakstype/data';
import { getTildelteSakerPerKlageenhetState } from '@/components/graphs/tildelte-saker-per-klageenhet/data';
import { getTildelteSakerPerYtelseOgKlageenhetState } from '@/components/graphs/tildelte-saker-per-ytelse-og-klageenhet/data';
import { getTildelteSakerPåVentIkkePåVentState } from '@/components/graphs/tildelte-saker-på-vent-ikke-på-vent/data';
import { getVarsletFristState } from '@/components/graphs/varslet-frist/data';
import { getVarsletFristPerYtelseState } from '@/components/graphs/varslet-frist-per-ytelse/data';
import { InternalServerError, UnauthorizedError } from '@/lib/errors';
import { type GetGraphStateJsonFn, GRAPH_DATA_EVENT_NAME, Graph, isGraphName } from '@/lib/graphs';
import { getLogger } from '@/lib/logger';
import { getKlageenheter, getSakstyperWithoutAnkeITR, getYtelser } from '@/lib/server/api';
import { BEHANDLINGER_DATA_LOADER } from '@/lib/server/behandlinger';
import type { DataListener } from '@/lib/server/data-loader';
import { generateSpanId, generateTraceId } from '@/lib/server/traceparent';
import type { Behandling } from '@/lib/server/types';

export const dynamic = 'force-dynamic';

interface Params {
  graph: string;
}

interface Context {
  params: Promise<Params>;
}

export async function GET(request: NextRequest, { params }: Context) {
  const graphName = (await params).graph;

  if (!isGraphName(graphName)) {
    return notFound();
  }

  const log = getLogger(`graphs-${graphName}`);
  const { searchParams } = request.nextUrl;
  const filters = parseFilters(searchParams);
  const traceId = generateTraceId();
  const spanId = generateSpanId();

  const getGraphState = GRAPH_DATA_LOADERS[graphName];

  try {
    const ytelser = await getYtelser();
    const sakstyper = await getSakstyperWithoutAnkeITR();
    const klageenheter = await getKlageenheter();

    const initialBehandlinger = BEHANDLINGER_DATA_LOADER.getData();

    const textEncoder = new TextEncoder();

    let listener: DataListener<Behandling> | null = null;

    const eventStream = new ReadableStream({
      start(controller) {
        listener = (behandlinger) => {
          const filteredBehandlinger = filterBehandlinger(behandlinger, filters, traceId);

          const json = getGraphState({
            behandlinger: filteredBehandlinger,
            ytelser,
            sakstyper,
            klageenheter,
            searchParams,
          });

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

const GRAPH_DATA_LOADERS: Record<Graph, GetGraphStateJsonFn> = {
  [Graph.SAKER_PER_YTELSE_OG_SAKSTYPE]: (...args) => JSON.stringify(getSakerPerYtelseOgSakstypeState(...args)),

  [Graph.ALDER_PER_YTELSE]: (...args) => JSON.stringify(getAlderPerYtelseState(...args)),

  [Graph.ALDER]: (...args) => JSON.stringify(getAlderState(...args)),

  [Graph.FRIST_I_KABAL_PER_YTELSE]: (...args) => JSON.stringify(getFristIKabalPerYtelseState(...args)),

  [Graph.FRIST_I_KABAL]: (...args) => JSON.stringify(getFristIKabalState(...args)),

  [Graph.TILDELTE_SAKER_PER_KLAGEENHET]: (...args) => JSON.stringify(getTildelteSakerPerKlageenhetState(...args)),

  [Graph.SAKER_PER_SAKSTYPE]: (...args) => JSON.stringify(getSakerPerSakstypeState(...args)),

  [Graph.TILDELTE_SAKER_PER_YTELSE_OG_KLAGEENHET]: (...args) =>
    JSON.stringify(getTildelteSakerPerYtelseOgKlageenhetState(...args)),

  [Graph.VARSLET_FRIST]: (...args) => JSON.stringify(getVarsletFristState(...args)),

  [Graph.VARSLET_FRIST_PER_YTELSE]: (...args) => JSON.stringify(getVarsletFristPerYtelseState(...args)),

  [Graph.FRIST_PER_YTELSE]: (...args) => JSON.stringify(getFristPerYtelseState(...args)),

  [Graph.LEDIGE_VS_TILDELTE]: (...args) => JSON.stringify(getLedigeVsTildelteState(...args)),

  [Graph.TILDELTE_SAKER_PÅ_VENT_IKKE_PÅ_VENT]: (...args) =>
    JSON.stringify(getTildelteSakerPåVentIkkePåVentState(...args)),
};

const hash = (input: string, length = 8): string =>
  createHash('sha256').update(input).digest('hex').substring(0, length);
