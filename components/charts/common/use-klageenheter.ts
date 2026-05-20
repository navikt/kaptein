import { useMemo } from 'react';
import { UNKNOWN_ENHET_ID, UNKNOWN_ENHET_NAME } from '@/lib/constants';
import type { BaseBehandling, IKodeverkSimpleValue } from '@/lib/types';

export const useKlageenheterWithUnknown = (
  behandlinger: Pick<BaseBehandling, 'tildeltEnhet'>[],
  klageenheter: IKodeverkSimpleValue[],
) =>
  useMemo<IKodeverkSimpleValue[]>(() => {
    const hasUnknownEnhet = behandlinger.some(({ tildeltEnhet }) => tildeltEnhet == null);
    return hasUnknownEnhet ? [{ id: UNKNOWN_ENHET_ID, navn: UNKNOWN_ENHET_NAME }, ...klageenheter] : klageenheter;
  }, [klageenheter, behandlinger]);
