import { isBefore } from 'date-fns';
import { ExceededFrist } from '@/components/behandlinger/use-frist-color';
import type { State } from '@/components/graphs/varslet-frist/type';
import type { GetGraphStateFn } from '@/lib/graphs';
import type { Behandling } from '@/lib/server/types';

export const getVarsletFristState: GetGraphStateFn<State, Behandling> = ({ behandlinger }) => {
  const TODAY = new Date();

  const map = behandlinger.reduce<Record<ExceededFrist, number>>(
    (acc, curr) => {
      const key =
        curr.varsletFrist === null
          ? ExceededFrist.NULL
          : isBefore(new Date(curr.varsletFrist), TODAY)
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

  return {
    state: Object.entries(map)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value })),
    count: behandlinger.length,
  };
};
