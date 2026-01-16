import { endOfMonth, format, startOfMonth, subMonths } from 'date-fns';
import { usePathname } from 'next/navigation';
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import {
  parseAsHjemlerModeFilter,
  parseAsTilbakekrevingFilter,
  parseAsTildelingFilter,
} from '@/app/custom-query-parsers';
import { HjemlerModeFilter, TilbakekrevingFilter, TildelingFilter } from '@/app/query-types';
import { RouteName } from '@/components/header/route-name';
import { ISO_DATE_FORMAT, NOW, TODAY } from '@/lib/date';
import { QueryParam } from '@/lib/types/query-param';

export const useYtelsesgrupperFilter = () =>
  useQueryState(
    QueryParam.YTELSESGRUPPER,
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ clearOnDefault: true }),
  );

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

export const useKaSakstyperFilter = () =>
  useQueryState(
    QueryParam.KA_SAKSTYPER,
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ clearOnDefault: true }),
  );

export const useTrSakstyperFilter = () =>
  useQueryState(
    QueryParam.TR_SAKSTYPER,
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ clearOnDefault: true }),
  );

export const useTildelingFilter = () =>
  useQueryState(
    QueryParam.TILDELING,
    parseAsTildelingFilter.withDefault(TildelingFilter.ALL).withOptions({ clearOnDefault: false }),
  );

export const useFromFilter = () => {
  const path = usePathname();

  return useQueryState(
    QueryParam.FROM,
    parseAsString
      .withDefault(path === RouteName.SAKSSTRØM ? SAKSSTRØM_DEFAULT_FROM : DEFAULT_FROM)
      .withOptions({ clearOnDefault: false }),
  );
};

export const useToFilter = () => {
  const path = usePathname();

  return useQueryState(
    QueryParam.TO,
    parseAsString
      .withDefault(path === RouteName.SAKSSTRØM ? SAKSSTRØM_DEFAULT_TO : DEFAULT_TO)
      .withOptions({ clearOnDefault: false }),
  );
};

export const useTilbakekrevingFilter = () =>
  useQueryState(
    QueryParam.TILBAKEKREVING,
    parseAsTilbakekrevingFilter.withDefault(TilbakekrevingFilter.MED).withOptions({ clearOnDefault: false }),
  );

export const useKaUtfallFilter = () =>
  useQueryState(
    QueryParam.KA_UTFALL,
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ clearOnDefault: true }),
  );

export const useTrUtfallFilter = () =>
  useQueryState(
    QueryParam.TR_UTFALL,
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ clearOnDefault: true }),
  );

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
const DEFAULT_TO = TODAY;
const DEFAULT_FROM = format(startOfMonth(NOW), ISO_DATE_FORMAT);
const SAKSSTRØM_DEFAULT_FROM = format(startOfMonth(subMonths(NOW, 4)), ISO_DATE_FORMAT);
const SAKSSTRØM_DEFAULT_TO = format(endOfMonth(subMonths(NOW, 1)), ISO_DATE_FORMAT);
