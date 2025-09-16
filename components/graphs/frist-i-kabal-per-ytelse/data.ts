import { isBefore } from 'date-fns';
import { ExceededFrist, getFristColor } from '@/components/behandlinger/use-frist-color';
import { getRelevantYtelser } from '@/components/graphs/common';
import type { Serie, State } from '@/components/graphs/frist-i-kabal-per-ytelse/types';
import type { GetGraphStateFn } from '@/lib/graphs';
import type { Behandling, IKodeverkSimpleValue } from '@/lib/server/types';

export const getFristIKabalPerYtelseState: GetGraphStateFn<State, Behandling> = ({ behandlinger, ytelser }) => {
  const relevanteYtelser = getRelevantYtelser(behandlinger, ytelser);
  const series = getSeries(relevanteYtelser, behandlinger);
  const labels = getLabels(relevanteYtelser, series);

  return { state: { series, labels }, count: behandlinger.length };
};

const getSeries = (relevanteYtelser: IKodeverkSimpleValue<string>[], behandlinger: Behandling[]) =>
  Object.values(ExceededFrist).map((type) => ({
    type: 'bar',
    stack: 'total',
    label: { show: true },
    emphasis: { focus: 'series' },
    name: type,
    color: getFristColor(type),
    data: relevanteYtelser
      .map(({ id }) => behandlinger.reduce((acc, curr) => (curr.ytelseId === id ? acc + getData(curr, type) : acc), 0))
      .map((value) => (value === 0 ? null : value)),
  }));

const getLabels = (relevantYtelser: IKodeverkSimpleValue<string>[], series: Serie[]) =>
  relevantYtelser.map((y, i) => `${y.navn} (${series.reduce((acc, curr) => acc + (curr.data[i] ?? 0), 0)})`);

const TODAY = new Date();

const getData = (behandling: Behandling, exceeded: ExceededFrist): number => {
  switch (exceeded) {
    case ExceededFrist.NULL:
      return behandling.frist === null ? 1 : 0;
    case ExceededFrist.EXCEEDED:
      return behandling.frist !== null && isBefore(new Date(behandling.frist), TODAY) ? 1 : 0;
    case ExceededFrist.NOT_EXCEEDED:
      return behandling.frist !== null && !isBefore(new Date(behandling.frist), TODAY) ? 1 : 0;
  }
};
