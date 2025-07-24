import { useMemo } from 'react';
import type { Behandling, IKodeverkSimpleValue, IYtelse } from '@/lib/server/types';

export const useRelevantYtelser = (behandlinger: Behandling[], ytelser: IYtelse[]): IKodeverkSimpleValue[] =>
  useMemo(() => {
    const ids = Array.from(new Set(behandlinger.map((b) => b.ytelseId)));

    return ids
      .map((id) => {
        const kodeverk = ytelser.find((k) => k.id === id);

        return kodeverk === undefined ? { id, navn: id } : { id, navn: kodeverk.navn };
      })
      .toSorted((a, b) => a.navn.localeCompare(b.navn));
  }, [behandlinger, ytelser]);
