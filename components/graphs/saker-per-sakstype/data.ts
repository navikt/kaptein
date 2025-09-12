import type { State } from '@/components/graphs/saker-per-sakstype/types';
import { DARK } from '@/lib/echarts/dark';
import { LIGHT } from '@/lib/echarts/light';
import { SAKSTYPE_COLORS } from '@/lib/echarts/sakstype-colors';
import type { GetGraphStateFn } from '@/lib/graphs';
import type { Behandling, Sakstype } from '@/lib/server/types';

export const getSakerPerSakstypeState: GetGraphStateFn<State> = ({ behandlinger, sakstyper }) => {
  const map = behandlinger.reduce<Map<Sakstype, { value: number; name: string }>>((acc, curr) => {
    const existing = acc.get(curr.typeId);

    if (existing) {
      existing.value += 1;
    } else {
      acc.set(curr.typeId, {
        name: sakstyper.find((s) => s.id === curr.typeId)?.navn ?? (curr.typeId || curr.typeId),
        value: 1,
      });
    }
    return acc;
  }, new Map());

  return {
    state: { data: Object.values(Object.fromEntries(map)), ...getSakstypeColors(behandlinger) },
    count: behandlinger.length,
  };
};

interface Colors {
  darkColors: string[];
  lightColors: string[];
}

// Due to a bug in pie chart when hovering (emphasis) we have to hard code the colors instead of using tokens
const getSakstypeColors = (behandlinger: Behandling[]): Colors => {
  const relevantSakstyper = Array.from(new Set(behandlinger.map((b) => b.typeId)));

  const darkColors = relevantSakstyper.map((s) => SAKSTYPE_COLORS[s]).map((t) => DARK[t]);
  const lightColors = relevantSakstyper.map((s) => SAKSTYPE_COLORS[s]).map((t) => LIGHT[t]);

  return { darkColors, lightColors };
};
