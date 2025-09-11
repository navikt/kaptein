import { isBefore } from 'date-fns';
import type { GetGraphStateParams } from '@/app/api/graphs/[graph]/data-fn-types';
import { ExceededFrist } from '@/components/behandlinger/use-frist-color';
import type { Serie } from '@/components/graphs/frist-i-kabal/types';
import type { EntryData } from '@/lib/graphs';
import type { Behandling } from '@/lib/server/types';

export const getFristIKabalState = ({ behandlinger }: GetGraphStateParams): EntryData<Serie> => {
  const state = getData(behandlinger);

  return { state, count: behandlinger.length };
};

const TODAY = new Date();

const getData = (behandlinger: Behandling[]): Serie => {
  const map = behandlinger.reduce<Record<ExceededFrist, number>>(
    (acc, curr) => {
      const key =
        curr.frist === null
          ? ExceededFrist.NULL
          : isBefore(new Date(curr.frist), TODAY)
            ? ExceededFrist.EXCEEDED
            : ExceededFrist.NOT_EXCEEDED;

      acc[key] = acc[key] + 1;

      return acc;
    },
    {
      [ExceededFrist.EXCEEDED]: 0,
      [ExceededFrist.NOT_EXCEEDED]: 0,
      [ExceededFrist.NULL]: 0,
    },
  );

  return Object.entries(map)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));
};
