'use client';

import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { parseAsLedigeFilter, TildelingFilter } from '@/app/custom-parses';
import type { Behandling } from '@/lib/server/types';

export const useData = (behandlinger: Behandling[]) => {
  const [ytelseFilter] = useQueryState('ytelser', parseAsArrayOf(parseAsString));
  const [klageenheterFilter] = useQueryState('klageenheter', parseAsArrayOf(parseAsString));
  const [hjemlerFilter] = useQueryState('hjemler', parseAsArrayOf(parseAsString));
  const [sakstyperFilter] = useQueryState('sakstyper', parseAsArrayOf(parseAsString));
  const [tildelingFilter] = useQueryState('tildeling', parseAsLedigeFilter);

  const ytelser = ytelseFilter ?? [];
  const klageenheter = klageenheterFilter ?? [];
  const hjemler = hjemlerFilter ?? [];
  const sakstyper = sakstyperFilter ?? [];
  const tildeling = tildelingFilter ?? TildelingFilter.ALL;

  return useMemo(() => {
    const filteredForAnkeITR = behandlinger.filter((b) => b.typeId !== ANKE_I_TRYGDERETTEN_ID);

    const filteredForSakstyper =
      sakstyper.length === 0 ? filteredForAnkeITR : filteredForAnkeITR.filter((b) => sakstyper.includes(b.typeId));

    const filteredForYtelser =
      ytelser.length === 0 ? filteredForSakstyper : filteredForSakstyper.filter((b) => ytelser.includes(b.ytelseId));

    const filteredForKlageenheter =
      klageenheter.length === 0
        ? filteredForYtelser
        : filteredForYtelser.filter((b) => klageenheter.includes(b.fraNAVEnhet));

    const filteredForHjemler =
      hjemler.length === 0
        ? filteredForKlageenheter
        : filteredForKlageenheter.filter((b) => hjemler.some((h) => b.resultat.hjemmelIdSet.includes(h)));

    const filteredForTildelte =
      tildeling === TildelingFilter.ALL
        ? filteredForHjemler
        : filteredForHjemler.filter((b) => b.isTildelt === (tildeling === TildelingFilter.TILDELTE));

    return { withoutTildelteFilter: filteredForHjemler, withTildelteFilter: filteredForTildelte };
  }, [behandlinger, ytelser, klageenheter, hjemler, tildeling, sakstyper]);
};

const ANKE_I_TRYGDERETTEN_ID = '3';
