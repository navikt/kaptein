import { Age } from '@/components/behandlinger/use-frist-color';
import type { State } from '@/components/graphs/alder/types';
import type { GetGraphStateFn } from '@/lib/graphs';
import type { Behandling } from '@/lib/server/types';
import { QueryParam } from '@/lib/types/query-param';

export const getAlderState: GetGraphStateFn<State, Behandling> = ({ behandlinger, searchParams }) => {
  const maxAge = parseMaxAge(searchParams);

  const map = behandlinger.reduce<Record<Age, number>>(
    (acc, curr) => {
      if (curr.ageKA > maxAge) {
        acc[Age.OLDER] = acc[Age.OLDER] + 1;
      } else {
        acc[Age.YOUNGER] = acc[Age.YOUNGER] + 1;
      }
      return acc;
    },
    {
      [Age.OLDER]: 0,
      [Age.YOUNGER]: 0,
    },
  );

  const state = Object.entries(map)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));

  return { count: behandlinger.length, state };
};

const parseMaxAge = (searchParams: URLSearchParams): number => {
  const maxAge = searchParams.get(QueryParam.ALDER_MAX_DAYS);

  if (maxAge === null) {
    return 0;
  }

  const parsed = Number.parseInt(maxAge, 10);

  return Number.isNaN(parsed) ? 0 : parsed;
};
