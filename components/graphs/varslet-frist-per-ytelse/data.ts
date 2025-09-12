import { isBefore } from 'date-fns';
import { ExceededFrist, getFristColor } from '@/components/behandlinger/use-frist-color';
import { getRelevantYtelser } from '@/components/graphs/common';
import type { Serie, State } from '@/components/graphs/varslet-frist-per-ytelse/types';
import type { GetGraphStateFn } from '@/lib/graphs';
import type { Behandling, IKodeverkSimpleValue } from '@/lib/server/types';

export const getVarsletFristPerYtelseState: GetGraphStateFn<State> = ({ behandlinger, ytelser }) => {
  const relevanteYtelser = getRelevantYtelser(behandlinger, ytelser);
  const series = getSeries(behandlinger, relevanteYtelser);
  const labels = getLabels(relevanteYtelser, series);

  return { state: { series, labels }, count: behandlinger.length };
};

const getSeries = (behandlinger: Behandling[], relevanteYtelser: IKodeverkSimpleValue<string>[]) =>
  Object.values(ExceededFrist).map((type) => ({
    type: 'bar',
    stack: 'total',
    label: { show: true },
    emphasis: { focus: 'series' },
    name: type,
    color: getFristColor(type),
    data: relevanteYtelser
      .map(({ id }) =>
        behandlinger.reduce((acc, curr) => {
          return curr.ytelseId === id ? acc + getData(curr, type) : acc;
        }, 0),
      )
      .map((value) => (value === 0 ? null : value)),
  }));

const getLabels = (relevanteYtelser: IKodeverkSimpleValue<string>[], series: Serie[]) =>
  relevanteYtelser.map((y, i) => `${y.navn} (${series.reduce((acc, curr) => acc + (curr.data[i] ?? 0), 0)})`);

const getData = (behandling: Behandling, exceeded: ExceededFrist): number => {
  const TODAY = new Date();
  switch (exceeded) {
    case ExceededFrist.NULL:
      return behandling.varsletFrist === null ? 1 : 0;
    case ExceededFrist.EXCEEDED:
      return behandling.varsletFrist !== null && isBefore(new Date(behandling.varsletFrist), TODAY) ? 1 : 0;
    case ExceededFrist.NOT_EXCEEDED:
      return behandling.varsletFrist !== null && !isBefore(new Date(behandling.varsletFrist), TODAY) ? 1 : 0;
  }
};
