import type { Data, State } from '@/components/graphs/tildelte-saker-per-klageenhet/types';
import type { GetGraphStateFn } from '@/lib/graphs';
import type { Behandling, IKodeverkSimpleValue } from '@/lib/server/types';

export const getTildelteSakerPerKlageenhetState: GetGraphStateFn<State, Behandling> = ({
  behandlinger,
  klageenheter,
}) => {
  const data = getData(behandlinger, klageenheter);

  const labels = data.map((d) => d.name);
  const values = data.map((d) => d.value);

  return { state: { labels, values }, count: behandlinger.length };
};

const getData = (behandlinger: Behandling[], klageenheter: IKodeverkSimpleValue[]): Data[] => {
  const map = new Map<string | null, Data>();

  behandlinger.forEach((b) => {
    const existing = map.get(b.tildeltEnhet);

    if (existing) {
      existing.value += 1;
    } else {
      map.set(b.tildeltEnhet, {
        name:
          b.tildeltEnhet === null
            ? 'Ikke tildelt'
            : (klageenheter.find((k) => k.id === b.tildeltEnhet)?.navn ?? b.tildeltEnhet),
        value: 1,
      });
    }
  });

  return Object.values(Object.fromEntries(map));
};
