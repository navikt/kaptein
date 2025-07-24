export enum QueryParam {
  YTELSER = 'y',
  KLAGEENHETER = 'ke',
  REGISTRERINGSHJEMLER = 'rh',
  INNSENDINGSHJEMLER = 'ih',
  SAKSTYPER = 'st',
  TILDELING = 'td',
  FROM = 'f',
  TO = 't',
  TILBAKEKREVING = 'tbk',
  UTFALL = 'u',
  ALDER_MAX_DAYS = 'ma',
  ALDER_PER_YTELSE_MAX_DAYS = 'apyma',
}

export const ALL_QUERY_PARAMS = Object.values(QueryParam);
