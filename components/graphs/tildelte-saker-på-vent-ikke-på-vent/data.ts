import type { State } from '@/components/graphs/tildelte-saker-på-vent-ikke-på-vent/types';
import type { GetGraphStateFn } from '@/lib/graphs';
import type { TildeltBehandling } from '@/lib/server/types';

export const getTildelteSakerPåVentIkkePåVentState: GetGraphStateFn<State, TildeltBehandling> = ({ behandlinger }) => {
  const map = behandlinger.reduce<Map<boolean, { value: number; name: string }>>((acc, curr) => {
    const value = curr.sattPaaVent === null;
    const existing = acc.get(value);

    if (existing) {
      existing.value += 1;
    } else {
      acc.set(value, {
        name: value ? 'Ikke på vent' : 'På vent',
        value: 1,
      });
    }
    return acc;
  }, new Map());

  return {
    state: [...map.values()],
    count: behandlinger.length,
  };
};
