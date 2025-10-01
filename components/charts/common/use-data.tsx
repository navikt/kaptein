'use client';

import { isAfter, isBefore } from 'date-fns';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { parseAsTilbakekrevingFilter } from '@/app/custom-query-parsers';
import { TilbakekrevingFilter } from '@/app/query-types';
import { useDateFilter } from '@/components/charts/common/use-date-filter';
import {
  type Behandling,
  type FerdigstiltBehandling,
  isFerdigstilt,
  type LedigBehandling,
  type TildeltBehandling,
} from '@/lib/server/types';
import { QueryParam } from '@/lib/types/query-param';

export const useFerdigstilte = (behandlinger: FerdigstiltBehandling[]) => {
  const { fromFilter, toFilter } = useDateFilter();
  const [registreringshjemlerFilter] = useQueryState(QueryParam.REGISTRERINGSHJEMLER, parseAsArrayOf(parseAsString));
  const [utfallFilter] = useQueryState(QueryParam.UTFALL, parseAsArrayOf(parseAsString));
  const registreringshjemler = registreringshjemlerFilter ?? [];
  const utfall = utfallFilter ?? [];

  const baseFiltered = useFiltered(behandlinger);

  return useMemo(() => {
    const filteredForUtfall =
      utfall.length === 0 ? baseFiltered : baseFiltered.filter((b) => utfall.includes(b.resultat.utfallId));

    const filteredForFrom =
      fromFilter === null
        ? filteredForUtfall
        : filteredForUtfall.filter((b) => !isBefore(new Date(b.avsluttetAvSaksbehandlerDate), fromFilter));

    const filteredForTo =
      toFilter === null
        ? filteredForFrom
        : filteredForFrom.filter((b) => !isAfter(new Date(b.avsluttetAvSaksbehandlerDate), toFilter));

    const filteredForRegistreringshjemler =
      registreringshjemler.length === 0
        ? filteredForTo
        : filteredForTo.filter((b) => registreringshjemler.some((h) => b.resultat.hjemmelIdSet.includes(h)));

    return filteredForRegistreringshjemler;
  }, [baseFiltered, fromFilter, toFilter, registreringshjemler, utfall]);
};

export const useSaksstrøm = (behandlinger: Behandling[]) => {
  const { fromFilter, toFilter } = useDateFilter();
  const [registreringshjemlerFilter] = useQueryState(QueryParam.REGISTRERINGSHJEMLER, parseAsArrayOf(parseAsString));
  const [utfallFilter] = useQueryState(QueryParam.UTFALL, parseAsArrayOf(parseAsString));
  const registreringshjemler = registreringshjemlerFilter ?? [];
  const utfall = utfallFilter ?? [];

  const baseFiltered = useFiltered(behandlinger);

  console.log(toFilter);

  return useMemo(() => {
    const filteredForUtfall =
      utfall.length === 0
        ? baseFiltered
        : baseFiltered.filter((b) => isFerdigstilt(b) && utfall.includes(b.resultat.utfallId));

    console.log('filteredForUtfall', filteredForUtfall);

    const filteredForFrom =
      fromFilter === null
        ? filteredForUtfall
        : filteredForUtfall.filter((b) =>
            isFerdigstilt(b)
              ? !isBefore(new Date(b.avsluttetAvSaksbehandlerDate), fromFilter)
              : !isBefore(new Date(b.created), fromFilter),
          );
    console.log('filteredForFrom', filteredForFrom);

    const filteredForTo =
      toFilter === null
        ? filteredForFrom
        : filteredForFrom.filter((b) =>
            isFerdigstilt(b) ? !isAfter(new Date(b.created), toFilter) : !isAfter(new Date(b.created), toFilter),
          );

    console.log('filteredForTo', filteredForTo);

    const filteredForRegistreringshjemler =
      registreringshjemler.length === 0
        ? filteredForTo
        : filteredForTo.filter((b) =>
            registreringshjemler.some((h) => isFerdigstilt(b) && b.resultat.hjemmelIdSet.includes(h)),
          );
    console.log('filteredForRegistreringshjemler', filteredForRegistreringshjemler);

    return filteredForRegistreringshjemler;
  }, [baseFiltered, fromFilter, toFilter, registreringshjemler, utfall]);
};

export const useAktive = (behandlinger: (LedigBehandling | TildeltBehandling)[]) => {
  return useFiltered(behandlinger);
};

export const useTildelte = (behandlinger: TildeltBehandling[]) => {
  return useFiltered(behandlinger);
};

const useFiltered = <T extends Behandling>(behandlinger: T[]): T[] => {
  const [ytelseFilter] = useQueryState(QueryParam.YTELSER, parseAsArrayOf(parseAsString));
  const [klageenheterFilter] = useQueryState(QueryParam.KLAGEENHETER, parseAsArrayOf(parseAsString));
  const [innsendingshjemlerFilter] = useQueryState(QueryParam.INNSENDINGSHJEMLER, parseAsArrayOf(parseAsString));
  const [sakstyperFilter] = useQueryState(QueryParam.SAKSTYPER, parseAsArrayOf(parseAsString));

  const [tilbakekrevingFilter] = useQueryState(QueryParam.TILBAKEKREVING, parseAsTilbakekrevingFilter);

  const ytelser = ytelseFilter ?? [];
  const klageenheter = klageenheterFilter ?? [];
  const innsendingshjemler = innsendingshjemlerFilter ?? [];
  const sakstyper = sakstyperFilter ?? [];
  const tilbakekreving = tilbakekrevingFilter ?? TilbakekrevingFilter.MED;

  return useMemo(() => {
    const filteredForTilbakekreving =
      tilbakekreving === TilbakekrevingFilter.MED
        ? behandlinger
        : behandlinger.filter((b) => b.tilbakekreving === (tilbakekreving === TilbakekrevingFilter.KUN));

    const filteredForSakstyper =
      sakstyper.length === 0
        ? filteredForTilbakekreving
        : filteredForTilbakekreving.filter((b) => sakstyper.includes(b.typeId));

    const filteredForYtelser =
      ytelser.length === 0 ? filteredForSakstyper : filteredForSakstyper.filter((b) => ytelser.includes(b.ytelseId));

    const filteredForKlageenheter =
      klageenheter.length === 0
        ? filteredForYtelser
        : filteredForYtelser.filter((b) => b.tildeltEnhet !== null && klageenheter.includes(b.tildeltEnhet));

    const filteredForInnsendingshjemler =
      innsendingshjemler.length === 0
        ? filteredForKlageenheter
        : filteredForKlageenheter.filter((b) => innsendingshjemler.some((h) => b.hjemmelIdList.includes(h)));

    return filteredForInnsendingshjemler;
  }, [behandlinger, ytelser, klageenheter, innsendingshjemler, sakstyper, tilbakekreving]);
};
