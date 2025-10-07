'use client';

import { isAfter, isBefore } from 'date-fns';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { parseAsTilbakekrevingFilter } from '@/app/custom-query-parsers';
import { TilbakekrevingFilter } from '@/app/query-types';
import { useDateFilter } from '@/components/charts/common/use-date-filter';
import type { BaseBehandling, Ferdigstilt, Frist, Ledig, Tildelt } from '@/lib/types';
import { QueryParam } from '@/lib/types/query-param';

export const useFerdigstilte = (behandlinger: (BaseBehandling & Ferdigstilt & Frist)[]) => {
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
        : filteredForTo.filter((b) =>
            registreringshjemler.some((h) => b.resultat.registreringshjemmelIdList.includes(h)),
          );

    return filteredForRegistreringshjemler;
  }, [baseFiltered, fromFilter, toFilter, registreringshjemler, utfall]);
};

export const useFerdigstiltSaksstrøm = (ferdigstilteBehandlinger: (BaseBehandling & Ferdigstilt)[]) => {
  const { fromFilter, toFilter } = useDateFilter();
  const [registreringshjemlerFilter] = useQueryState(QueryParam.REGISTRERINGSHJEMLER, parseAsArrayOf(parseAsString));
  const [utfallFilter] = useQueryState(QueryParam.UTFALL, parseAsArrayOf(parseAsString));
  const registreringshjemler = registreringshjemlerFilter ?? [];
  const utfall = utfallFilter ?? [];

  const ferdigstilteFilteredBase = useFiltered(ferdigstilteBehandlinger);

  return useMemo(() => {
    const filteredForAvsluttetFrom =
      fromFilter === null
        ? ferdigstilteFilteredBase
        : ferdigstilteFilteredBase.filter((b) => !isBefore(new Date(b.avsluttetAvSaksbehandlerDate), fromFilter));

    const filteredForAvsluttetTo =
      toFilter === null
        ? filteredForAvsluttetFrom
        : filteredForAvsluttetFrom.filter((b) => !isAfter(new Date(b.avsluttetAvSaksbehandlerDate), toFilter));

    const filteredForRegistreringshjemler =
      registreringshjemler.length === 0
        ? filteredForAvsluttetTo
        : filteredForAvsluttetTo.filter((b) =>
            registreringshjemler.some((h) => b.resultat.registreringshjemmelIdList.includes(h)),
          );

    const filteredForUtfall =
      utfall.length === 0
        ? filteredForRegistreringshjemler
        : filteredForRegistreringshjemler.filter((b) => utfall.includes(b.resultat.utfallId));

    return filteredForUtfall;
  }, [ferdigstilteFilteredBase, fromFilter, toFilter, registreringshjemler, utfall]);
};

export const useUferdigeSaksstrøm = (behandlinger: (BaseBehandling & (Ledig | Tildelt))[]) => {
  const { fromFilter, toFilter } = useDateFilter();

  const filteredBase = useFiltered(behandlinger);

  return useMemo(() => {
    const filteredForCreatedFrom =
      fromFilter === null
        ? filteredBase
        : filteredBase.filter((b) => !isBefore(new Date(b.mottattKlageinstans), fromFilter));

    const filteredForCreatedTo =
      toFilter === null
        ? filteredForCreatedFrom
        : filteredForCreatedFrom.filter((b) => !isAfter(new Date(b.mottattKlageinstans), toFilter));

    return filteredForCreatedTo;
  }, [filteredBase, fromFilter, toFilter]);
};

export const useAktive = <T extends BaseBehandling>(behandlinger: T[]) => useFiltered<T>(behandlinger);

export const useTildelte = <T extends BaseBehandling & Tildelt>(behandlinger: T[]) => useFiltered<T>(behandlinger);

const useFiltered = <T extends BaseBehandling>(behandlinger: T[]): T[] => {
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
        : filteredForKlageenheter.filter((b) => innsendingshjemler.some((h) => b.innsendingshjemmelIdList.includes(h)));

    return filteredForInnsendingshjemler;
  }, [behandlinger, ytelser, klageenheter, innsendingshjemler, sakstyper, tilbakekreving]);
};
