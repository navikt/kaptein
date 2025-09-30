// Employee from vedtaksinstans or KA.
export interface INavEmployee {
  navIdent: string;
  navn: string;
}

export interface IUserData extends INavEmployee {
  navIdent: string;
  navn: string;
  roller: Role[];
  enheter: IEnhet[];
  ansattEnhet: IEnhet;
  tildelteYtelser: string[];
}

export enum Role {
  KABAL_SAKSBEHANDLING = 'KABAL_SAKSBEHANDLING',
  KABAL_INNSYN_EGEN_ENHET = 'KABAL_INNSYN_EGEN_ENHET',
  KABAL_OPPGAVESTYRING_ALLE_ENHETER = 'KABAL_OPPGAVESTYRING_ALLE_ENHETER',
  KABAL_TILGANGSSTYRING_EGEN_ENHET = 'KABAL_TILGANGSSTYRING_EGEN_ENHET',
  KABAL_FAGTEKSTREDIGERING = 'KABAL_FAGTEKSTREDIGERING',
  KABAL_MALTEKSTREDIGERING = 'KABAL_MALTEKSTREDIGERING',
  KABAL_ROL = 'KABAL_ROL',
  KABAL_KROL = 'KABAL_KROL',
  KABAL_SVARBREVINNSTILLINGER = 'KABAL_SVARBREVINNSTILLINGER',
  KABAL_ADMIN = 'KABAL_ADMIN',
  STRENGT_FORTROLIG = 'STRENGT_FORTROLIG',
  FORTROLIG = 'FORTROLIG',
  EGEN_ANSATT = 'EGEN_ANSATT',
}

interface IEnhet {
  id: string;
  navn: string;
  lovligeYtelser: string[];
}

export interface IKodeverkSimpleValue<T extends string = string> {
  id: T;
  navn: string;
}

export interface IKodeverkValue<T extends string = string> extends IKodeverkSimpleValue<T> {
  beskrivelse: string;
}

export interface ILovKildeToRegistreringshjemmel {
  lovkilde: IKodeverkValue;
  registreringshjemler: IKodeverkSimpleValue[];
}

export interface IYtelse extends IKodeverkSimpleValue {
  lovKildeToRegistreringshjemler: ILovKildeToRegistreringshjemmel[];
  innsendingshjemler: IKodeverkValue[];
  enheter: IKodeverkSimpleValue[];
  klageenheter: IKodeverkSimpleValue[];
}

export interface BaseBehandling<T extends Sakstype = Sakstype> {
  id: string;
  created: string;
  typeId: T;
  ytelseId: string;
  ageKA: number;
  innsendingshjemmelIdList: string[];
  tilbakekreving: boolean;
  tildeltEnhet: string | null;
}

export interface Ledig {
  isTildelt: false;
  sattPaaVent: null;
  tildeltEnhet: null;
  avsluttetAvSaksbehandlerDate: never;
}

export interface Tildelt {
  isTildelt: true;
  sattPaaVentReasonId: PåVentReason | null;
  tildeltEnhet: string;
}

export interface Ferdigstilt {
  avsluttetAvSaksbehandlerDate: string;
  tildeltEnhet: string;
  isTildelt: true;
  sattPaaVentReasonId: never;
  resultat: {
    utfallId: string;
    registreringshjemmelIdList: string[];
  };
}

export interface Frist {
  frist: string | null;
  varsletFrist: string | null;
  avsluttetAvSaksbehandlerDate: never;
}

// Klage
export type KlageLedig = BaseBehandling<Sakstype.KLAGE> & Ledig & Frist;
export type KlageTildelt = BaseBehandling<Sakstype.KLAGE> & Tildelt & Frist;
export type KlageFerdigstilt = BaseBehandling<Sakstype.KLAGE> & Ferdigstilt & Frist;

export type KlagerLedigeResponse = KapteinApiResponse<KlageLedig>;
export type KlagerTildelteResponse = KapteinApiResponse<KlageTildelt>;
export type KlagerFerdigstilteResponse = KapteinApiResponse<KlageFerdigstilt>;

// Anke
export type AnkeLedig = BaseBehandling<Sakstype.ANKE> & Ledig & Frist;
export type AnkeTildelt = BaseBehandling<Sakstype.ANKE> & Tildelt & Frist;
export type AnkeFerdigstilt = BaseBehandling<Sakstype.ANKE> & Ferdigstilt & Frist;

export type AnkerLedigeResponse = KapteinApiResponse<AnkeLedig>;
export type AnkerTildelteResponse = KapteinApiResponse<AnkeTildelt>;
export type AnkerFerdigstilteResponse = KapteinApiResponse<AnkeFerdigstilt>;

// Behandling etter TR opphevet
export type BetongLedig = BaseBehandling<Sakstype.BEHANDLING_ETTER_TR_OPPHEVET> & Ledig & Frist;
export type BetongTildelt = BaseBehandling<Sakstype.BEHANDLING_ETTER_TR_OPPHEVET> & Tildelt & Frist;
export type BetongFerdigstilt = BaseBehandling<Sakstype.BEHANDLING_ETTER_TR_OPPHEVET> & Ferdigstilt & Frist;

export type BetongLedigeResponse = KapteinApiResponse<BetongLedig>;
export type BetongTildelteResponse = KapteinApiResponse<BetongTildelt>;
export type BetongFerdigstilteResponse = KapteinApiResponse<BetongFerdigstilt>;

// Omgjøringskrav
export type OmgjøringskravLedig = BaseBehandling<Sakstype.OMGJØRINGSKRAV> & Ledig & Frist;
export type OmgjøringskravTildelt = BaseBehandling<Sakstype.OMGJØRINGSKRAV> & Tildelt & Frist;
export type OmgjøringskravFerdigstilt = BaseBehandling<Sakstype.OMGJØRINGSKRAV> & Ferdigstilt & Frist;

export type OmgjøringskravLedigeResponse = KapteinApiResponse<OmgjøringskravLedig>;
export type OmgjøringskravTildelteResponse = KapteinApiResponse<OmgjøringskravTildelt>;
export type OmgjøringskravFerdigstilteResponse = KapteinApiResponse<OmgjøringskravFerdigstilt>;

export interface KapteinApiResponse<T> {
  behandlinger: T[];
  total: number;
}

export enum Sakstype {
  KLAGE = '1',
  ANKE = '2',
  ANKE_I_TRYGDERETTEN = '3',
  BEHANDLING_ETTER_TR_OPPHEVET = '4',
  OMGJØRINGSKRAV = '5',
}

export enum PåVentReason {
  VENTER_PAA_TILSVAR = '1',
  VENTER_PAA_DOKUMENTASJON = '2',
  VENTER_PAA_AVKLARING_OM_DOEDSBO = '3',
  SATT_I_BERO = '4',
  ANNET = '5',
}

export interface SakstypeToUtfall extends IKodeverkSimpleValue<Sakstype> {
  utfall: IKodeverkSimpleValue[];
}
