import { isAfter, isBefore, parse } from 'date-fns';
import type { parseFilters } from '@/app/api/graphs/parse-params';
import { TilbakekrevingFilter, TildelingFilter } from '@/app/query-types';
import { ISO_DATE_FORMAT } from '@/lib/date';
import type { Behandling } from '@/lib/server/types';
import { TILBAKEKREVINGINNSENDINGSHJEMLER } from '@/lib/types/tilbakekrevingshjemler';

export const filterBehandlinger = (behandlinger: Behandling[], params: ReturnType<typeof parseFilters>) => {
  const {
    finished,
    tildelt,
    ytelseFilter,
    klageenheterFilter,
    registreringshjemlerFilter,
    innsendingshjemlerFilter,
    sakstyperFilter,
    tildelingFilter,
    fromFilter,
    toFilter,
    tilbakekrevingFilter,
    utfallFilter,
    ignoreTildeltFilter,
  } = params;

  const filteredForFeilregistrert = behandlinger.filter((b) => b.feilregistrering === null);

  const filteredForFinished =
    finished === null
      ? filteredForFeilregistrert
      : filteredForFeilregistrert.filter((b) => b.isAvsluttetAvSaksbehandler === finished);

  const filteredForTildelt =
    tildelt === null ? filteredForFinished : filteredForFinished.filter((b) => b.isTildelt === tildelt);

  const filteredForAnkeITR = filteredForTildelt.filter((b) => b.typeId !== ANKE_I_TRYGDERETTEN_ID);

  const filteredForUtfall =
    utfallFilter.length === 0
      ? filteredForAnkeITR
      : filteredForAnkeITR.filter((b) => utfallFilter.includes(b.resultat.utfallId));

  const filteredForTilbakekreving =
    tilbakekrevingFilter === TilbakekrevingFilter.MED
      ? filteredForUtfall
      : filteredForUtfall.filter((b) => filterForTilbakekreving(b, tilbakekrevingFilter));

  const filteredForFrom =
    fromFilter === null
      ? filteredForTilbakekreving
      : filteredForTilbakekreving.filter((b) =>
          b.avsluttetAvSaksbehandlerDate === null
            ? !isBefore(parseISODate(b.created), fromFilter)
            : !isBefore(parseISODate(b.avsluttetAvSaksbehandlerDate), fromFilter),
        );

  const filteredForTo =
    toFilter === null
      ? filteredForFrom
      : filteredForFrom.filter((b) =>
          b.avsluttetAvSaksbehandlerDate === null
            ? !isAfter(parseISODate(b.created), toFilter)
            : !isAfter(parseISODate(b.avsluttetAvSaksbehandlerDate), toFilter),
        );

  const filteredForSakstyper =
    sakstyperFilter.length === 0 ? filteredForTo : filteredForTo.filter((b) => sakstyperFilter.includes(b.typeId));

  const filteredForYtelser =
    ytelseFilter.length === 0
      ? filteredForSakstyper
      : filteredForSakstyper.filter((b) => ytelseFilter.includes(b.ytelseId));

  const filteredForKlageenheter =
    klageenheterFilter.length === 0
      ? filteredForYtelser
      : filteredForYtelser.filter(
          ({ tildeltEnhet }) => tildeltEnhet !== null && klageenheterFilter.includes(tildeltEnhet),
        );

  const filteredForInnsendingshjemler =
    innsendingshjemlerFilter.length === 0
      ? filteredForKlageenheter
      : filteredForKlageenheter.filter((b) => innsendingshjemlerFilter.some((h) => b.hjemmelIdList.includes(h)));

  const filteredForRegistreringshjemler =
    registreringshjemlerFilter.length === 0
      ? filteredForInnsendingshjemler
      : filteredForInnsendingshjemler.filter((b) =>
          registreringshjemlerFilter.some((h) => b.resultat.hjemmelIdSet.includes(h)),
        );

  if (ignoreTildeltFilter || tildelingFilter === TildelingFilter.ALL) {
    return filteredForRegistreringshjemler;
  }

  return filteredForInnsendingshjemler.filter((b) => b.isTildelt === (tildelingFilter === TildelingFilter.TILDELTE));
};

const ANKE_I_TRYGDERETTEN_ID = '3';

const filterForTilbakekreving = (behandling: Behandling, filter: TilbakekrevingFilter) => {
  // Filter on tilbakekreving flag for finished behandling
  if (behandling.isAvsluttetAvSaksbehandler) {
    return behandling.tilbakekreving === (filter === TilbakekrevingFilter.KUN);
  }

  // Filter on innsendingshjemler for active behandling

  if (filter === TilbakekrevingFilter.KUN) {
    return behandling.hjemmelIdList.some((h) => TILBAKEKREVINGINNSENDINGSHJEMLER.includes(h));
  }

  if (filter === TilbakekrevingFilter.UTEN) {
    return !behandling.hjemmelIdList.some((h) => TILBAKEKREVINGINNSENDINGSHJEMLER.includes(h));
  }

  return true;
};

const parseISODate = (date: string) => parse(date, ISO_DATE_FORMAT, new Date());
