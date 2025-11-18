import { QueryParam } from '@/lib/types/query-param';

const COMMON_PARAMS = [QueryParam.KLAGEENHETER, QueryParam.SAKSTYPER, QueryParam.YTELSER, QueryParam.TILBAKEKREVING];

// These will not show in active filters pills, so they can be kept in the "background"
const ALWAYS_KEEP_PARAMS = [QueryParam.ALDER_MAX_DAYS, QueryParam.ALDER_PER_YTELSE_MAX_DAYS];

export enum RouteName {
  AKTIVE = '/aktive',
  FERDIGSTILTE = '/ferdigstilte',
  SAKSSTRØM = '/saksstroem',
  BEHANDLINGSTID = '/behandlingstid',
  AKTIVE_SAKER_I_TR = '/aktive-saker-i-tr',
  FERDIGSTILTE_I_TR = '/ferdigstilte-saker-i-tr',
}

export const KEEP_PARAMS: Record<RouteName, QueryParam[]> = {
  [RouteName.AKTIVE]: [
    ...COMMON_PARAMS,
    ...ALWAYS_KEEP_PARAMS,
    QueryParam.INNSENDINGSHJEMLER_MODE,
    QueryParam.INNSENDINGSHJEMLER,
    QueryParam.TILDELING,
    QueryParam.ALDER_MAX_DAYS,
    QueryParam.ALDER_PER_YTELSE_MAX_DAYS,
  ],
  [RouteName.FERDIGSTILTE]: [
    ...COMMON_PARAMS,
    ...ALWAYS_KEEP_PARAMS,
    QueryParam.FROM,
    QueryParam.TO,
    QueryParam.UTFALL,
    QueryParam.REGISTRERINGSHJEMLER_MODE,
    QueryParam.REGISTRERINGSHJEMLER,
    QueryParam.ALDER_MAX_DAYS,
    QueryParam.ALDER_PER_YTELSE_MAX_DAYS,
  ],
  [RouteName.SAKSSTRØM]: [
    ...COMMON_PARAMS,
    ...ALWAYS_KEEP_PARAMS,
    QueryParam.FROM,
    QueryParam.TO,
    QueryParam.UTFALL,
    QueryParam.INNSENDINGSHJEMLER_MODE,
    QueryParam.INNSENDINGSHJEMLER,
    QueryParam.TILDELING,
  ],
  [RouteName.BEHANDLINGSTID]: [
    ...COMMON_PARAMS,
    ...ALWAYS_KEEP_PARAMS,
    QueryParam.FROM,
    QueryParam.TO,
    QueryParam.UTFALL,
    QueryParam.REGISTRERINGSHJEMLER_MODE,
    QueryParam.REGISTRERINGSHJEMLER,
  ],
  [RouteName.AKTIVE_SAKER_I_TR]: [
    ...COMMON_PARAMS,
    ...ALWAYS_KEEP_PARAMS,
    QueryParam.INNSENDINGSHJEMLER_MODE,
    QueryParam.INNSENDINGSHJEMLER,
    QueryParam.REGISTRERINGSHJEMLER_MODE,
    QueryParam.REGISTRERINGSHJEMLER,
    QueryParam.ALDER_MAX_DAYS,
    QueryParam.ALDER_PER_YTELSE_MAX_DAYS,
  ],
  [RouteName.FERDIGSTILTE_I_TR]: [
    ...COMMON_PARAMS,
    ...ALWAYS_KEEP_PARAMS,
    QueryParam.FROM,
    QueryParam.TO,
    QueryParam.UTFALL,
    QueryParam.INNSENDINGSHJEMLER_MODE,
    QueryParam.INNSENDINGSHJEMLER,
    QueryParam.REGISTRERINGSHJEMLER_MODE,
    QueryParam.REGISTRERINGSHJEMLER,
    QueryParam.ALDER_MAX_DAYS,
    QueryParam.ALDER_PER_YTELSE_MAX_DAYS,
  ],
};
