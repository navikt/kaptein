'use client';

import { isAfter, isBefore } from 'date-fns';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import {
  parseAsDate,
  parseAsLedigeFilter,
  parseAsTilbakekrevingFilter,
  TilbakekrevingFilter,
  TildelingFilter,
} from '@/app/custom-parsers';
import type { Behandling } from '@/lib/server/types';

export const useData = (behandlinger: Behandling[]) => {
  const [ytelseFilter] = useQueryState('ytelser', parseAsArrayOf(parseAsString));
  const [klageenheterFilter] = useQueryState('klageenheter', parseAsArrayOf(parseAsString));
  const [hjemlerFilter] = useQueryState('hjemler', parseAsArrayOf(parseAsString));
  const [sakstyperFilter] = useQueryState('sakstyper', parseAsArrayOf(parseAsString));
  const [tildelingFilter] = useQueryState('tildeling', parseAsLedigeFilter);
  const [fromFilter] = useQueryState('from', parseAsDate);
  const [toFilter] = useQueryState('to', parseAsDate);
  const [tilbakekrevingFilter] = useQueryState('tilbakekreving', parseAsTilbakekrevingFilter);
  const [utfallFilter] = useQueryState('utfall', parseAsArrayOf(parseAsString));

  const ytelser = ytelseFilter ?? [];
  const klageenheter = klageenheterFilter ?? [];
  const hjemler = hjemlerFilter ?? [];
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
        : filteredForUtfall.filter((b) => b.tilbakekreving === (tilbakekreving === TilbakekrevingFilter.KUN));

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

    const filteredForHjemler =
      hjemler.length === 0
        ? filteredForKlageenheter
        : filteredForKlageenheter.filter((b) => hjemler.some((h) => b.resultat.hjemmelIdSet.includes(h)));

    const filteredForTildelte =
      tildeling === TildelingFilter.ALL
        ? filteredForHjemler
        : filteredForHjemler.filter((b) => b.isTildelt === (tildeling === TildelingFilter.TILDELTE));

    return { withoutTildelteFilter: filteredForHjemler, withTildelteFilter: filteredForTildelte };
  }, [
    behandlinger,
    ytelser,
    klageenheter,
    hjemler,
    tildeling,
    sakstyper,
    fromFilter,
    toFilter,
    tilbakekreving,
    utfall,
  ]);
};

const ANKE_I_TRYGDERETTEN_ID = '3';
