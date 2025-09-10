import type { Serie, State } from '@/components/behandlinger/alder-per-ytelse/types';
import { Age, getAgeColor } from '@/components/behandlinger/use-frist-color';
import type { Behandling, IKodeverkSimpleValue, IYtelse } from '@/lib/server/types';

export const getAlderPerYtelseState = (
  behandlinger: Behandling[],
  ytelser: IYtelse[],
  searchParams: URLSearchParams,
): State => {
  const maxAge = parseMaxAge(searchParams);
  const relevanteYtelser = getRelevantYtelser(behandlinger, ytelser);
  const series = getSeries(relevanteYtelser, behandlinger, maxAge);
  const labels = getLabels(relevanteYtelser, series);

  return { series, labels, count: behandlinger.length };
};

const parseMaxAge = (searchParams: URLSearchParams): number | null => {
  const maxAge = searchParams.get('ma');

  if (maxAge === null) {
    return null;
  }

  const parsed = Number.parseInt(maxAge, 10);

  return Number.isNaN(parsed) ? null : parsed;
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

const getSeries = (relevantYtelser: IKodeverkSimpleValue[], behandlinger: Behandling[], maxAge: number | null) =>
  Object.values(Age).map((type) => ({
    type: 'bar',
    stack: 'total',
    label: { show: true },
    emphasis: { focus: 'series' },
    name: type,
    color: getAgeColor(type),
    data: relevantYtelser
      .map(({ id }) =>
        behandlinger.reduce((acc, curr) => (curr.ytelseId === id ? acc + getData(curr, type, maxAge ?? 0) : acc), 0),
      )
      .map((value) => (value === 0 ? null : value)),
  }));

const getData = (behandling: Behandling, age: Age, maxAge: number): number => {
  switch (age) {
    case Age.OLDER:
      return behandling.ageKA !== null && behandling.ageKA >= maxAge ? 1 : 0;
    case Age.YOUNGER:
      return behandling.ageKA !== null && behandling.ageKA < maxAge ? 1 : 0;
  }
};

const getLabels = (relevantYtelser: IKodeverkSimpleValue[], series: Serie[]) =>
  relevantYtelser.map((y, i) => `${y.navn} (${series.reduce((acc, curr) => acc + (curr.data[i] ?? 0), 0)})`);
