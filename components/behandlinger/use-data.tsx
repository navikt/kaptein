'use client';

import { isAfter, isBefore } from 'date-fns';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { parseAsDate, parseAsLedigeFilter, parseAsTilbakekrevingFilter } from '@/app/custom-query-parsers';
import { TilbakekrevingFilter, TildelingFilter } from '@/app/query-types';
import type { Behandling } from '@/lib/server/types';
import { QueryParam } from '@/lib/types/query-param';

export const useData = (behandlinger: Behandling[]) => {
  const [ytelseFilter] = useQueryState(QueryParam.YTELSER, parseAsArrayOf(parseAsString));
  const [klageenheterFilter] = useQueryState(QueryParam.KLAGEENHETER, parseAsArrayOf(parseAsString));
  const [registreringshjemlerFilter] = useQueryState(QueryParam.REGISTRERINGSHJEMLER, parseAsArrayOf(parseAsString));
  const [innsendingshjemlerFilter] = useQueryState(QueryParam.INNSENDINGSHJEMLER, parseAsArrayOf(parseAsString));
  const [sakstyperFilter] = useQueryState(QueryParam.SAKSTYPER, parseAsArrayOf(parseAsString));
  const [tildelingFilter] = useQueryState(QueryParam.TILDELING, parseAsLedigeFilter);
  const [fromFilter] = useQueryState(QueryParam.FROM, parseAsDate);
  const [toFilter] = useQueryState(QueryParam.TO, parseAsDate);
  const [tilbakekrevingFilter] = useQueryState(QueryParam.TILBAKEKREVING, parseAsTilbakekrevingFilter);
  const [utfallFilter] = useQueryState(QueryParam.UTFALL, parseAsArrayOf(parseAsString));

  const ytelser = ytelseFilter ?? [];
  const klageenheter = klageenheterFilter ?? [];
  const registreringshjemler = registreringshjemlerFilter ?? [];
  const innsendingshjemler = innsendingshjemlerFilter ?? [];
  const sakstyper = sakstyperFilter ?? [];
  const utfall = utfallFilter ?? [];
  const tildeling = tildelingFilter ?? TildelingFilter.ALL;
  const tilbakekreving = tilbakekrevingFilter ?? TilbakekrevingFilter.MED;

  return useMemo(() => {
    const filteredForAnkeITR = behandlinger.filter((b) => b.typeId !== ANKE_I_TRYGDERETTEN_ID);

    const filteredForUtfall =
      utfall.length === 0 ? filteredForAnkeITR : filteredForAnkeITR.filter((b) => utfall.includes(b.resultat.utfallId));

    const filteredForTilbakekreving =
      tilbakekreving === TilbakekrevingFilter.MED
        ? filteredForUtfall
        : filteredForUtfall.filter((b) => filterForTilbakekreving(b, tilbakekreving));

    const filteredForFrom =
      fromFilter === null
        ? filteredForTilbakekreving
        : filteredForTilbakekreving.filter((b) =>
            b.avsluttetAvSaksbehandlerDate === null
              ? !isBefore(new Date(b.created), fromFilter)
              : !isBefore(new Date(b.avsluttetAvSaksbehandlerDate), fromFilter),
          );

    const filteredForTo =
      toFilter === null
        ? filteredForFrom
        : filteredForFrom.filter((b) =>
            b.avsluttetAvSaksbehandlerDate === null
              ? !isAfter(new Date(b.created), toFilter)
              : !isAfter(new Date(b.avsluttetAvSaksbehandlerDate), toFilter),
          );

    const filteredForSakstyper =
      sakstyper.length === 0 ? filteredForTo : filteredForTo.filter((b) => sakstyper.includes(b.typeId));

    const filteredForYtelser =
      ytelser.length === 0 ? filteredForSakstyper : filteredForSakstyper.filter((b) => ytelser.includes(b.ytelseId));

    const filteredForKlageenheter =
      klageenheter.length === 0
        ? filteredForYtelser
        : filteredForYtelser.filter((b) => klageenheter.includes(b.fraNAVEnhet));

    const filteredForInnsendingshjemler =
      innsendingshjemler.length === 0
        ? filteredForKlageenheter
        : filteredForKlageenheter.filter((b) => innsendingshjemler.some((h) => b.hjemmelIdList.includes(h)));

    const filteredForRegistreringshjemler =
      registreringshjemler.length === 0
        ? filteredForInnsendingshjemler
        : filteredForInnsendingshjemler.filter((b) =>
            registreringshjemler.some((h) => b.resultat.hjemmelIdSet.includes(h)),
          );

    const filteredForTildelte =
      tildeling === TildelingFilter.ALL
        ? filteredForInnsendingshjemler
        : filteredForInnsendingshjemler.filter((b) => b.isTildelt === (tildeling === TildelingFilter.TILDELTE));

    return { withoutTildelteFilter: filteredForRegistreringshjemler, withTildelteFilter: filteredForTildelte };
  }, [
    behandlinger,
    ytelser,
    klageenheter,
    registreringshjemler,
    innsendingshjemler,
    tildeling,
    sakstyper,
    fromFilter,
    toFilter,
    tilbakekreving,
    utfall,
  ]);
};

const ANKE_I_TRYGDERETTEN_ID = '3';

const filterForTilbakekreving = (behandling: Behandling, filter: TilbakekrevingFilter) => {
  // Filter on tilbakekreving flag for finished behandling
  if (behandling.isAvsluttetAvSaksbehandler) {
    return behandling.tilbakekreving === (filter === TilbakekrevingFilter.KUN);
  }

  // Filter on innsendingshjemler for active behandling

  if (filter === TilbakekrevingFilter.KUN) {
    return behandling.hjemmelIdList.some((h) => TILBAKEKREVINGHJEMLER.includes(h));
  }

  if (filter === TilbakekrevingFilter.UTEN) {
    return !behandling.hjemmelIdList.some((h) => TILBAKEKREVINGHJEMLER.includes(h));
  }

  return true;
};

const TILBAKEKREVINGHJEMLER = [
  'FTRL_22_15_TILBAKEKREVING',
  'FTRL_22_15_TILBAKEKREVING_DOEDSBO',
  '1000.022.015',
  'FTRL_22_15_1_1',
  'FTRL_22_15_1_2',
  'FTRL_22_15_2',
  'FTRL_22_15_4',
  'FTRL_22_15_5',
  'FTRL_22_15_6',
  'FTRL_22_17A',
  'FTRL_4_28',
  '596',
  '614',
  '706',
];
