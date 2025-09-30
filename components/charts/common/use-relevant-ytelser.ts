import { useMemo } from 'react';
import type { Behandling, IKodeverkSimpleValue, IYtelse } from '@/lib/server/types';

type YtelseBehandling = Pick<Behandling, 'ytelseId'>;

export const useRelevantYtelser = (behandlinger: YtelseBehandling[], ytelser: IYtelse[]): IKodeverkSimpleValue[] =>
  useMemo(() => {
    const ids = Array.from(new Set(behandlinger.map((b) => b.ytelseId)));

    return ids
      .map((id) => {
        const kodeverk = ytelser.find((k) => k.id === id);

        return kodeverk === undefined ? { id, navn: id } : { id, navn: kodeverk.navn };
      })
      .toSorted((a, b) => b.navn.localeCompare(a.navn));
  }, [behandlinger, ytelser]);
