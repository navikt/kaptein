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
  OVERSKREDET_VARSLET_FRIST_DAYS = 'ovf',
  OVERSKREDET_FRIST_I_KABAL_DAYS = 'ofik',
  ALDER_MAX_DAYS = 'ma',
}

export const ALL_QUERY_PARAMS = Object.values(QueryParam);
