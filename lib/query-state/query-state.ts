import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import {
  parseAsHjemlerModeFilter,
  parseAsTilbakekrevingFilter,
  parseAsTildelingFilter,
} from '@/app/custom-query-parsers';
import { HjemlerModeFilter, TilbakekrevingFilter, TildelingFilter } from '@/app/query-types';
import { TODAY } from '@/lib/date';
import { QueryParam } from '@/lib/types/query-param';

export const useYtelserFilter = () =>
  useQueryState(
    QueryParam.YTELSER,
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ clearOnDefault: true }),
  );

export const useKlageenheterFilter = () =>
  useQueryState(
    QueryParam.KLAGEENHETER,
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ clearOnDefault: true }),
  );

export const useRegistreringshjemlerFilter = () =>
  useQueryState(
    QueryParam.REGISTRERINGSHJEMLER,
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ clearOnDefault: true }),
  );

export const useInnsendingshjemlerFilter = () =>
  useQueryState(
    QueryParam.INNSENDINGSHJEMLER,
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ clearOnDefault: true }),
  );

export const useSakstyperFilter = () =>
  useQueryState(
    QueryParam.SAKSTYPER,
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ clearOnDefault: true }),
  );

export const useTildelingFilter = () =>
  useQueryState(
    QueryParam.TILDELING,
    parseAsTildelingFilter.withDefault(TildelingFilter.ALL).withOptions({ clearOnDefault: false }),
  );

export const useFromFilter = (defaultValue = TODAY) =>
  useQueryState(QueryParam.FROM, parseAsString.withDefault(defaultValue).withOptions({ clearOnDefault: false }));

export const useToFilter = (defaultValue = TODAY) =>
  useQueryState(QueryParam.TO, parseAsString.withDefault(defaultValue).withOptions({ clearOnDefault: false }));

export const useTilbakekrevingFilter = () =>
  useQueryState(
    QueryParam.TILBAKEKREVING,
    parseAsTilbakekrevingFilter.withDefault(TilbakekrevingFilter.MED).withOptions({ clearOnDefault: false }),
  );

export const useUtfallFilter = () =>
  useQueryState(QueryParam.UTFALL, parseAsArrayOf(parseAsString).withDefault([]).withOptions({ clearOnDefault: true }));

export const useAlderMaxDaysFilter = () =>
  useQueryState(
    QueryParam.ALDER_MAX_DAYS,
    parseAsInteger.withDefault(TWELVE_WEEKS_IN_DAYS).withOptions({ clearOnDefault: false }),
  );

export const useAlderPerYtelseMaxDaysFilter = () =>
  useQueryState(
    QueryParam.ALDER_PER_YTELSE_MAX_DAYS,
    parseAsInteger.withDefault(TWELVE_WEEKS_IN_DAYS).withOptions({ clearOnDefault: false }),
  );

export const useInnsendingshjemlerModeFilter = () =>
  useQueryState(
    QueryParam.INNSENDINGSHJEMLER_MODE,
    parseAsHjemlerModeFilter.withDefault(HjemlerModeFilter.INCLUDE_FOR_SOME).withOptions({ clearOnDefault: false }),
  );

export const useRegistreringshjemlerModeFilter = () =>
  useQueryState(
    QueryParam.REGISTRERINGSHJEMLER_MODE,
    parseAsHjemlerModeFilter.withDefault(HjemlerModeFilter.INCLUDE_FOR_SOME).withOptions({ clearOnDefault: false }),
  );

const TWELVE_WEEKS_IN_DAYS = 12 * 7;
