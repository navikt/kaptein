import type { NextRequest } from 'next/server';
import { getSakstypeColor } from '@/lib/echarts/get-colors';
import { InternalServerError, UnauthorizedError } from '@/lib/errors';
import { getSakstyperWithoutAnkeITR, getYtelser } from '@/lib/server/api';
import { BEHANDLINGER_DATA_LOADER } from '@/lib/server/behandlinger';
import type { Behandling, IKodeverkSimpleValue, IYtelse, Sakstype } from '@/lib/server/types';

export const dynamic = 'force-dynamic';

enum EventType {
  SERIES = 'series',
  LABELS = 'labels',
}

export interface SeriesEvent {
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

export type LabelsEvent = string[];

export async function GET(request: NextRequest) {
  try {
    const loading = BEHANDLINGER_DATA_LOADER.load();
    const sakstyper = await getSakstyperWithoutAnkeITR();
    const ytelser = await getYtelser();

    const encoder = new TextEncoder();

    const eventStream = new ReadableStream({
      async start(controller) {
        const { series, labels } = await getSeriesAndLabels(BEHANDLINGER_DATA_LOADER.getData(), sakstyper, ytelser);

        // Initial data or setup
        controller.enqueue(encoder.encode(format(EventType.LABELS, labels) + format(EventType.SERIES, series)));

        const removeListener = BEHANDLINGER_DATA_LOADER.addDataListener(async (behandlinger) => {
          const { series, labels } = await getSeriesAndLabels(behandlinger, sakstyper, ytelser);
          controller.enqueue(encoder.encode(format(EventType.LABELS, labels) + format(EventType.SERIES, series)));
        });

        loading.finally(() => {
          removeListener();
          controller.close();
        });

        // Handle client disconnection
        request.signal.onabort = () => {
          removeListener();
          controller.close();
          console.debug('Client disconnected');
        };
      },
      cancel() {
        console.debug('Stream cancelled');
      },
    });

    return new Response(eventStream, {
      headers: {
        'Content-Type': 'text/event-stream',
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

const format = (event: EventType, data: SeriesEvent[] | LabelsEvent) =>
  `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

const getSeriesAndLabels = async (
  behandlinger: Behandling[],
  sakstyper: IKodeverkSimpleValue<Sakstype>[],
  ytelser: IYtelse[],
) => {
  const relevantYtelser = getRelevantYtelser(behandlinger, ytelser);
  const series = calculateSeries(behandlinger, relevantYtelser, sakstyper);
  const labels = calculateLabels(relevantYtelser, series);

  return { series, labels };
};

const calculateSeries = (
  behandlinger: Behandling[],
  relevantYtelser: IKodeverkSimpleValue[],
  sakstyper: IKodeverkSimpleValue<Sakstype>[],
) =>
  sakstyper.map<SeriesEvent>((type) => ({
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

const calculateLabels = (relevantYtelser: IKodeverkSimpleValue[], series: SeriesEvent[]) =>
  relevantYtelser.map((y, i) => `${y.navn} (${series.reduce((acc, curr) => acc + (curr.data[i] ?? 0), 0)})`);

const getRelevantYtelser = (behandlinger: Behandling[], ytelser: IYtelse[]): IKodeverkSimpleValue[] =>
  Array.from(new Set(behandlinger.map((b) => b.ytelseId)))
    .map<IKodeverkSimpleValue>((id) => {
      const kodeverk = ytelser.find((k) => k.id === id);

      return kodeverk === undefined ? { id, navn: id } : { id, navn: kodeverk.navn };
    })
    .toSorted((a, b) => a.navn.localeCompare(b.navn));
