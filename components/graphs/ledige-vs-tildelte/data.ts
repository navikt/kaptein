import type { State } from '@/components/graphs/ledige-vs-tildelte/types';
import type { GetGraphStateFn } from '@/lib/graphs';

export const getLedigeVsTildelteState: GetGraphStateFn<State> = ({ behandlinger }) => {
  const map = behandlinger.reduce<Map<boolean, { value: number; name: string }>>((acc, curr) => {
    const existing = acc.get(curr.isTildelt);

    if (existing) {
      existing.value += 1;
    } else {
      acc.set(curr.isTildelt, {
        name: curr.isTildelt ? 'Tildelt' : 'Ledig',
        value: 1,
      });
    }
    return acc;
  }, new Map());

  return { state: [...map.values()], count: behandlinger.length };
};
