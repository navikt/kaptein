import { useMemo } from 'react';
import type { BaseBehandling, IKodeverkSimpleValue, IYtelse } from '@/lib/types';

export const useRelevantYtelser = (
  behandlinger: Pick<BaseBehandling, 'ytelseId'>[],
  ytelser: IYtelse[],
): IKodeverkSimpleValue[] =>
  useMemo(() => {
    const ids = Array.from(new Set(behandlinger.map((b) => b.ytelseId)));

    return ids
      .map((id) => {
        const kodeverk = ytelser.find((k) => k.id === id);

        return kodeverk === undefined ? { id, navn: id } : { id, navn: kodeverk.navn };
      })
      .toSorted((a, b) => b.navn.localeCompare(a.navn));
  }, [behandlinger, ytelser]);
