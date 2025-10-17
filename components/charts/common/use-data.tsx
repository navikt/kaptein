'use client';

import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { parseAsHjemlerModeFilter, parseAsTilbakekrevingFilter } from '@/app/custom-query-parsers';
import { TilbakekrevingFilter } from '@/app/query-types';
import { filterHjemler } from '@/components/charts/common/filter-hjemler';
import { useDateFilter } from '@/components/charts/common/use-date-filter';
import type { Avsluttet, BaseAnkeITR, BaseBehandling, Ferdigstilt, Frist } from '@/lib/types';
import { QueryParam } from '@/lib/types/query-param';

export const useFerdigstilteInPeriod = (behandlinger: (BaseBehandling & Avsluttet & Ferdigstilt & Frist)[]) => {
  const baseFiltered = useBaseFiltered(behandlinger);
  const ferdigstiltInPeriod = useFerdigstiltInPeriod(baseFiltered);
  const resultatFiltered = useResultatFiltered(ferdigstiltInPeriod);

  return resultatFiltered;
};

export const useFerdigstiltInPeriod = <T extends Avsluttet>(ferdigstilteBehandlinger: T[]) => {
  const { fromFilter, toFilter } = useDateFilter();

  return useMemo(() => {
    const filteredForPeriod: T[] = [];

    for (const behandling of ferdigstilteBehandlinger) {
      // If the case was finished before or after the period, it will be filtered out.
      if (behandling.avsluttetAvSaksbehandlerDate < fromFilter || behandling.avsluttetAvSaksbehandlerDate > toFilter) {
        continue;
      }

      filteredForPeriod.push(behandling);
    }

    return filteredForPeriod;
  }, [ferdigstilteBehandlinger, fromFilter, toFilter]);
};

export const useSentInPeriod = <T extends BaseAnkeITR>(ferdigstilteBehandlinger: T[]) => {
  const { fromFilter, toFilter } = useDateFilter();

  return useMemo(() => {
    const filteredForPeriod: T[] = [];

    for (const behandling of ferdigstilteBehandlinger) {
      // If the case was finished before or after the period, it will be filtered out.
      if (behandling.sendtTilTR < fromFilter || behandling.sendtTilTR > toFilter) {
        continue;
      }

      filteredForPeriod.push(behandling);
    }

    return filteredForPeriod;
  }, [ferdigstilteBehandlinger, fromFilter, toFilter]);
};

export const getRestanseAfterDate = (
  uferdige: BaseBehandling[],
  ferdigstilte: (BaseBehandling & Avsluttet)[],
  date: string,
) => {
  const restanse: BaseBehandling[] = [];

  for (const b of uferdige) {
    if (b.mottattKlageinstans <= date) {
      restanse.push(b);
    }
  }

  for (const b of ferdigstilte) {
    if (b.mottattKlageinstans <= date && b.avsluttetAvSaksbehandlerDate > date) {
      restanse.push(b);
    }
  }

  return restanse;
};

export const useMottattInPeriod = <T extends BaseBehandling>(behandlinger: T[]) => {
  const { fromFilter, toFilter } = useDateFilter();

  return useMemo(
    () => behandlinger.filter((b) => b.mottattKlageinstans <= toFilter && b.mottattKlageinstans >= fromFilter),
    [behandlinger, fromFilter, toFilter],
  );
};

export const useResultatFiltered = <T extends BaseBehandling & Ferdigstilt & Avsluttet>(
  ferdigstilteBehandlinger: T[],
) => {
  const [registreringshjemlerFilter] = useQueryState(QueryParam.REGISTRERINGSHJEMLER, parseAsArrayOf(parseAsString));
  const [utfallFilter] = useQueryState(QueryParam.UTFALL, parseAsArrayOf(parseAsString));
  const [hjemmelModeFilter] = useQueryState(QueryParam.REGISTRERINGSHJEMLER_MODE, parseAsHjemlerModeFilter);

  return useMemo(() => {
    const filteredForRegistreringshjemler = filterHjemler(
      ferdigstilteBehandlinger,
      registreringshjemlerFilter,
      hjemmelModeFilter,
      (b) => b.resultat.registreringshjemmelIdList,
    );

    const filteredForUtfall =
      utfallFilter === null || utfallFilter.length === 0
        ? filteredForRegistreringshjemler
        : filteredForRegistreringshjemler.filter((b) => utfallFilter.includes(b.resultat.utfallId));

    return filteredForUtfall;
  }, [ferdigstilteBehandlinger, registreringshjemlerFilter, utfallFilter, hjemmelModeFilter]);
};

export const useBaseFiltered = <T extends BaseBehandling>(behandlinger: T[]): T[] => {
  const [ytelseFilter] = useQueryState(QueryParam.YTELSER, parseAsArrayOf(parseAsString));
  const [klageenheterFilter] = useQueryState(QueryParam.KLAGEENHETER, parseAsArrayOf(parseAsString));
  const [innsendingshjemlerFilter] = useQueryState(QueryParam.INNSENDINGSHJEMLER, parseAsArrayOf(parseAsString));
  const [sakstyperFilter] = useQueryState(QueryParam.SAKSTYPER, parseAsArrayOf(parseAsString));
  const [hjemmelModeFilter] = useQueryState(QueryParam.INNSENDINGSHJEMLER_MODE, parseAsHjemlerModeFilter);
  const [tilbakekrevingFilter] = useQueryState(QueryParam.TILBAKEKREVING, parseAsTilbakekrevingFilter);

  const ytelser = ytelseFilter ?? [];
  const klageenheter = klageenheterFilter ?? [];
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

    const filteredForInnsendingshjemler = filterHjemler(
      filteredForKlageenheter,
      innsendingshjemlerFilter,
      hjemmelModeFilter,
      (b) => b.innsendingshjemmelIdList,
    );

    return filteredForInnsendingshjemler;
  }, [behandlinger, ytelser, klageenheter, innsendingshjemlerFilter, sakstyper, tilbakekreving, hjemmelModeFilter]);
};
