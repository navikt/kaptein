import { Age } from '@/components/behandlinger/use-frist-color';
import type { Serie } from '@/components/graphs/alder/types';
import type { GetGraphStateFn } from '@/lib/graphs';

export const getAlderState: GetGraphStateFn<Serie> = ({ filteredBehandlinger: behandlinger, searchParams }) => {
  const maxAge = parseMaxAge(searchParams);

  const map = behandlinger.reduce<Record<Age, number>>(
    (acc, curr) => {
      if (curr.ageKA > (maxAge ?? 0)) {
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

const parseMaxAge = (searchParams: URLSearchParams): number | null => {
  const maxAge = searchParams.get('ma');

  if (maxAge === null) {
    return null;
  }

  const parsed = Number.parseInt(maxAge, 10);

  return Number.isNaN(parsed) ? null : parsed;
};
