export enum QueryParam {
  YTELSER = 'y',
  KLAGEENHETER = 'ke',
  REGISTRERINGSHJEMLER = 'rh',
  INNSENDINGSHJEMLER = 'ih',
  KA_SAKSTYPER = 'kast',
  TR_SAKSTYPER = 'trst',
  TILDELING = 'td',
  FROM = 'f',
  TO = 't',
  TILBAKEKREVING = 'tbk',
  KA_UTFALL = 'kau',
  TR_UTFALL = 'tru',
  ALDER_MAX_DAYS = 'ma',
  ALDER_PER_YTELSE_MAX_DAYS = 'apyma',
  INNSENDINGSHJEMLER_MODE = 'ihm',
  REGISTRERINGSHJEMLER_MODE = 'rhm',
}

export const ALL_QUERY_PARAMS = Object.values(QueryParam);
