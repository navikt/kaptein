import type { NextRequest } from 'next/server';
import { filterData } from '@/app/api/graphs/saker-per-ytelse-og-sakstype/data';
import { getSakstypeColor } from '@/lib/echarts/get-colors';
import { InternalServerError, UnauthorizedError } from '@/lib/errors';
import { getLogger } from '@/lib/logger';
import { getSakstyperWithoutAnkeITR, getYtelser } from '@/lib/server/api';
import { BEHANDLINGER_DATA_LOADER } from '@/lib/server/behandlinger';
import type { DataListener } from '@/lib/server/data-loader';
import { generateSpanId, generateTraceId } from '@/lib/server/traceparent';
import type { Behandling, IKodeverkSimpleValue, IYtelse, Sakstype } from '@/lib/server/types';

const log = getLogger('graphs-saker-per-ytelse-og-sakstype');

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
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
          const { withTildelteFilter } = filterData(behandlinger, params);

          const relevanteYtelser = getRelevantYtelser(withTildelteFilter, ytelser);
          const series = getSeries(sakstyper, relevanteYtelser, withTildelteFilter);
          const labels = getLabels(relevanteYtelser, series);

          const json = JSON.stringify({ series, labels, count: withTildelteFilter.length });
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

const getRelevantYtelser = (behandlinger: Behandling[], ytelser: IYtelse[]): IKodeverkSimpleValue[] => {
  const ids = Array.from(new Set(behandlinger.map((b) => b.ytelseId)));

  return ids
    .map((id) => {
      const kodeverk = ytelser.find((k) => k.id === id);

      return kodeverk === undefined ? { id, navn: id } : { id, navn: kodeverk.navn };
    })
    .toSorted((a, b) => a.navn.localeCompare(b.navn));
};

interface Serie {
  type: string;
  stack: string;
  label: {
    show: boolean;
  };
  emphasis: {
    focus: string;
  };
  name: string;
  color: string;
  data: (number | null)[];
}

const getSeries = (
  sakstyper: IKodeverkSimpleValue<Sakstype>[],
  relevantYtelser: IKodeverkSimpleValue[],
  behandlinger: Behandling[],
) =>
  sakstyper.map<Serie>((type) => ({
    type: 'bar',
    stack: 'total',
    label: { show: true },
    emphasis: { focus: 'series' },
    name: type.navn,
    color: getSakstypeColor(type.id),
    data: relevantYtelser
      .map(({ id }) =>
        behandlinger.reduce((acc, curr) => (curr.ytelseId === id && curr.typeId === type.id ? acc + 1 : acc), 0),
      )
      .map((value) => (value === 0 ? null : value)),
  }));

const getLabels = (relevantYtelser: IKodeverkSimpleValue[], series: Serie[]) =>
  relevantYtelser.map((y, i) => `${y.navn} (${series.reduce((acc, curr) => acc + (curr.data[i] ?? 0), 0)})`);
