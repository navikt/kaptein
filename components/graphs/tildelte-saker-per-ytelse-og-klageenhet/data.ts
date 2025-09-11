import { getRelevantYtelser } from '@/components/graphs/common';
import type { Serie, State } from '@/components/graphs/tildelte-saker-per-ytelse-og-klageenhet/types';
import type { GetGraphStateFn, GetGraphStateParams } from '@/lib/graphs';
import type { IKodeverkSimpleValue } from '@/lib/server/types';

export const getTildelteSakerPerYtelseOgKlageenhetState: GetGraphStateFn<State> = (args) => {
  const { filteredBehandlinger: behandlinger, ytelser } = args;

  const relevanteYtelser = getRelevantYtelser(behandlinger, ytelser);

  const series = getSeries(relevanteYtelser, args);
  const labels = getLabels(relevanteYtelser, series);

  return { state: { series, labels }, count: args.filteredBehandlinger.length };
};

const getSeries = (
  relevanteYtelser: IKodeverkSimpleValue[],
  { filteredBehandlinger: behandlinger, klageenheter }: GetGraphStateParams,
) =>
  [...klageenheter].map((enhet) => ({
    type: 'bar',
    stack: 'total',
    label: { show: true },
    emphasis: { focus: 'series' },
    name: enhet.navn,
    data: relevanteYtelser
      .map(({ id }) =>
        behandlinger.reduce((acc, curr) => (curr.ytelseId === id && curr.tildeltEnhet === enhet.id ? acc + 1 : acc), 0),
      )
      .map((value) => (value === 0 ? null : value)),
  }));

const getLabels = (relevanteYtelser: IKodeverkSimpleValue[], series: Serie[]) =>
  relevanteYtelser.map((y, i) => `${y.navn} (${series.reduce((acc, curr) => acc + (curr.data[i] ?? 0), 0)})`);
