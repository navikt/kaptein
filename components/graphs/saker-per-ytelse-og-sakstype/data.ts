import { getRelevantYtelser } from '@/components/graphs/common';
import type { Serie, State } from '@/components/graphs/saker-per-ytelse-og-sakstype/types';
import { getSakstypeColor } from '@/lib/echarts/get-colors';
import type { GetGraphStateFn } from '@/lib/graphs';
import type { Behandling, IKodeverkSimpleValue, Sakstype } from '@/lib/server/types';

export const getSakerPerYtelseOgSakstypeState: GetGraphStateFn<State> = ({
  unfilteredBehandlinger,
  filteredBehandlinger,
  ytelser,
  sakstyper,
}) => {
  console.log('behandlinger SSE', filteredBehandlinger.length);
  const relevanteYtelser = getRelevantYtelser(unfilteredBehandlinger, ytelser);
  const series = getSeries(sakstyper, relevanteYtelser, filteredBehandlinger);
  const labels = getLabels(relevanteYtelser, series);

  return { state: { series, labels }, count: filteredBehandlinger.length };
};

const getSeries = (
  sakstyper: IKodeverkSimpleValue<Sakstype>[],
  relevantYtelser: IKodeverkSimpleValue[],
  behandlinger: Behandling[],
) =>
  sakstyper.map((type) => ({
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
