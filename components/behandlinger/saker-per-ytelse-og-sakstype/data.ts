import type { Serie, State } from '@/components/behandlinger/saker-per-ytelse-og-sakstype/types';
import { getSakstypeColor } from '@/lib/echarts/get-colors';
import type { Behandling, IKodeverkSimpleValue, IYtelse, Sakstype } from '@/lib/server/types';

export const getData = (
  behandlinger: Behandling[],
  ytelser: IYtelse[],
  sakstyper: IKodeverkSimpleValue<Sakstype>[],
): State => {
  const relevanteYtelser = getRelevantYtelser(behandlinger, ytelser);
  const series = getSeries(sakstyper, relevanteYtelser, behandlinger);
  const labels = getLabels(relevanteYtelser, series);

  return { series, labels, count: behandlinger.length };
};

const getRelevantYtelser = (behandlinger: Behandling[], ytelser: IYtelse[]): IKodeverkSimpleValue[] => {
  const ids = Array.from(new Set(behandlinger.map((b) => b.ytelseId)));

  return ids
    .map((id) => {
      const kodeverk = ytelser.find((k) => k.id === id);

      return kodeverk === undefined ? { id, navn: id } : { id, navn: kodeverk.navn };
    })
    .toSorted((a, b) => a.navn.localeCompare(b.navn));
};

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
