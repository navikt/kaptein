import type { State, ThemeColors } from '@/components/graphs/saker-per-sakstype/types';
import type { Behandling, IKodeverkSimpleValue, Sakstype } from '@/lib/server/types';

export const getSakerPerSakstypeState = (
  behandlinger: Behandling[],
  sakstyper: IKodeverkSimpleValue<Sakstype>[],
): State => {
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

  return { data: Object.values(Object.fromEntries(map)), colors: getSakstypeColors(behandlinger) };
};

import { AppTheme } from '@/lib/app-theme';
import { DARK } from '@/lib/echarts/dark';
import { LIGHT } from '@/lib/echarts/light';
import { SAKSTYPE_COLORS } from '@/lib/echarts/sakstype-colors';

// Due to a bug in pie chart when hovering (emphasis) we have to hard code the colors instead of using tokens
const getSakstypeColors = (behandlinger: Behandling[]): ThemeColors[] => {
  const relevantSakstyper = Array.from(new Set(behandlinger.map((b) => b.typeId)));

  return relevantSakstyper
    .map((s) => SAKSTYPE_COLORS[s])
    .map<ThemeColors>((t) => ({
      [AppTheme.LIGHT]: LIGHT[t],
      [AppTheme.DARK]: DARK[t],
    }));
};
