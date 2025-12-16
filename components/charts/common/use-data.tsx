'use client';

import { useMemo } from 'react';
import { TilbakekrevingFilter } from '@/app/query-types';
import { filterHjemler } from '@/components/charts/common/filter-hjemler';
import { useDateFilter } from '@/components/charts/common/use-date-filter';
import {
  useInnsendingshjemlerFilter,
  useInnsendingshjemlerModeFilter,
  useKaSakstyperFilter,
  useKaUtfallFilter,
  useKlageenheterFilter,
  useRegistreringshjemlerFilter,
  useRegistreringshjemlerModeFilter,
  useTilbakekrevingFilter,
  useTrSakstyperFilter,
  useYtelserFilter,
} from '@/lib/query-state/query-state';
import type { Avsluttet, BaseBehandling, BaseSakITR, Ferdigstilt, Frist } from '@/lib/types';

export const useFerdigstilteInPeriod = (behandlinger: (BaseBehandling & Avsluttet & Ferdigstilt & Frist)[]) => {
  const baseFiltered = useNonTrFiltered(behandlinger);
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

export const useSentInPeriod = <T extends BaseSakITR>(ferdigstilteBehandlinger: T[]) => {
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

const useResultatFiltered = <T extends BaseBehandling & Ferdigstilt & Avsluttet>(ferdigstilteBehandlinger: T[]) => {
  const [registreringshjemlerFilter] = useRegistreringshjemlerFilter();
  const [utfallFilter] = useKaUtfallFilter();
  const [hjemmelModeFilter] = useRegistreringshjemlerModeFilter();

  return useMemo(() => {
    const filteredForRegistreringshjemler = filterHjemler(
      ferdigstilteBehandlinger,
      registreringshjemlerFilter,
      hjemmelModeFilter,
      (b) => b.resultat.registreringshjemmelIdList,
    );

    const filteredForUtfall =
      utfallFilter.length === 0
        ? filteredForRegistreringshjemler
        : filteredForRegistreringshjemler.filter((b) => utfallFilter.includes(b.resultat.utfallId));

    return filteredForUtfall;
  }, [ferdigstilteBehandlinger, registreringshjemlerFilter, utfallFilter, hjemmelModeFilter]);
};

export const useBaseFiltered = <T extends BaseBehandling>(behandlinger: T[]): T[] => {
  const [ytelser] = useYtelserFilter();
  const [klageenheter] = useKlageenheterFilter();
  const [tilbakekreving] = useTilbakekrevingFilter();

  return useMemo(() => {
    const filteredForTilbakekreving =
      tilbakekreving === TilbakekrevingFilter.MED
        ? behandlinger
        : behandlinger.filter((b) => b.tilbakekreving === (tilbakekreving === TilbakekrevingFilter.KUN));

    const filteredForYtelser =
      ytelser.length === 0
        ? filteredForTilbakekreving
        : filteredForTilbakekreving.filter((b) => ytelser.includes(b.ytelseId));

    const filteredForKlageenheter =
      klageenheter.length === 0
        ? filteredForYtelser
        : filteredForYtelser.filter((b) => b.tildeltEnhet !== null && klageenheter.includes(b.tildeltEnhet));

    return filteredForKlageenheter;
  }, [behandlinger, ytelser, klageenheter, tilbakekreving]);
};

export const useNonTrFiltered = <T extends BaseBehandling>(behandlinger: T[]): T[] => {
  const [sakstyper] = useKaSakstyperFilter();
  const baseFiltered = useBaseFiltered(behandlinger);

  return useMemo(
    () => (sakstyper.length === 0 ? baseFiltered : baseFiltered.filter((b) => sakstyper.includes(b.typeId))),
    [baseFiltered, sakstyper],
  );
};

export const useAktiveFiltered = <T extends BaseBehandling>(behandlinger: T[]): T[] => {
  const [innsendingshjemler] = useInnsendingshjemlerFilter();
  const [hjemmelMode] = useInnsendingshjemlerModeFilter();

  const baseFiltered = useNonTrFiltered(behandlinger);

  return filterHjemler(baseFiltered, innsendingshjemler, hjemmelMode, (b) => b.innsendingshjemmelIdList);
};

const useBaseFilteredTr = <T extends BaseBehandling>(behandlinger: T[]): T[] => {
  const [sakstyper] = useTrSakstyperFilter();
  const [innsendingshjemler] = useInnsendingshjemlerFilter();
  const [hjemmelMode] = useInnsendingshjemlerModeFilter();

  const baseFiltered = useBaseFiltered(behandlinger);

  return useMemo(() => {
    const filteredForSakstyper =
      sakstyper.length === 0 ? baseFiltered : baseFiltered.filter((b) => sakstyper.includes(b.typeId));

    const filteredForInnsendingshjemler = filterHjemler(
      filteredForSakstyper,
      innsendingshjemler,
      hjemmelMode,
      (b) => b.innsendingshjemmelIdList,
    );

    return filteredForInnsendingshjemler;
  }, [baseFiltered, sakstyper, innsendingshjemler, hjemmelMode]);
};

export const useRegistreringshjemlerFiltered = <T extends BaseBehandling & Ferdigstilt>(behandlinger: T[]) => {
  const [registreringshjemlerFilter] = useRegistreringshjemlerFilter();
  const [registreringshjemmelModeFilter] = useRegistreringshjemlerModeFilter();

  return useMemo(
    () =>
      filterHjemler(
        behandlinger,
        registreringshjemlerFilter,
        registreringshjemmelModeFilter,
        (b) => b.resultat.registreringshjemmelIdList,
      ),
    [behandlinger, registreringshjemlerFilter, registreringshjemmelModeFilter],
  );
};

export const useSakITRFilter = <T extends BaseSakITR>(behandlinger: T[]) => {
  const [registreringshjemlerFilter] = useRegistreringshjemlerFilter();
  const [registreringshjemmelModeFilter] = useRegistreringshjemlerModeFilter();

  const filteredForInnsendingshjemler = useBaseFilteredTr(behandlinger);

  return useMemo(
    () =>
      filterHjemler(
        filteredForInnsendingshjemler,
        registreringshjemlerFilter,
        registreringshjemmelModeFilter,
        (b) => b.previousRegistreringshjemmelIdList ?? [],
      ),
    [filteredForInnsendingshjemler, registreringshjemlerFilter, registreringshjemmelModeFilter],
  );
};
