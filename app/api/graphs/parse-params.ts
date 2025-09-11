import { isValid, parse } from 'date-fns';
import { TilbakekrevingFilter, TildelingFilter } from '@/app/query-types';
import { ISO_DATE_FORMAT } from '@/lib/date';
import { QueryParam } from '@/lib/types/query-param';

export const parseFilters = (params: URLSearchParams) => {
  const ytelseFilter = parseStringArray(params.get(QueryParam.YTELSER));
  const klageenheterFilter = parseStringArray(params.get(QueryParam.KLAGEENHETER));
  const registreringshjemlerFilter = parseStringArray(params.get(QueryParam.REGISTRERINGSHJEMLER));
  const innsendingshjemlerFilter = parseStringArray(params.get(QueryParam.INNSENDINGSHJEMLER));
  const sakstyperFilter = parseStringArray(params.get(QueryParam.SAKSTYPER));
  const tildelingFilter = parseLedigeFilter(params.get(QueryParam.TILDELING));
  const fromFilter = parseDate(params.get(QueryParam.FROM));
  const toFilter = parseDate(params.get(QueryParam.TO));
  const tilbakekrevingFilter = parseTilbakekrevingFilter(params.get(QueryParam.TILBAKEKREVING));
  const utfallFilter = parseStringArray(params.get(QueryParam.UTFALL));

  return {
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
  };
};

const parseLedigeFilter = (value: string | null): TildelingFilter => {
  if (value === TildelingFilter.LEDIGE) {
    return TildelingFilter.LEDIGE;
  }

  if (value === TildelingFilter.TILDELTE) {
    return TildelingFilter.TILDELTE;
  }

  return TildelingFilter.ALL;
};

const parseTilbakekrevingFilter = (value: string | null): TilbakekrevingFilter => {
  if (value === TilbakekrevingFilter.UTEN) {
    return TilbakekrevingFilter.UTEN;
  }

  if (value === TilbakekrevingFilter.KUN) {
    return TilbakekrevingFilter.KUN;
  }

  return TilbakekrevingFilter.MED;
};

const parseDate = (value: string | null): Date | null => {
  if (value === null) {
    return null;
  }

  const date = parse(value, ISO_DATE_FORMAT, new Date());

  return isValid(date) ? date : null;
};

const parseStringArray = (value: string | null): string[] =>
  value === null || value.length === 0 ? [] : value.split(',');
