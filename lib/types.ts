export enum Utfall {
  TRUKKET = '1',
  RETUR = '2',
  OPPHEVET = '3',
  MEDHOLD = '4',
  DELVIS_MEDHOLD = '5',
  STADFESTET = '6',
  UGUNST = '7',
  AVVIST = '8',
  INNSTILLING_STADFESTET = '9',
  INNSTILLING_AVVIST = '10',
  HEVET = '11',
  HENVIST = '12',
  MEDHOLD_FORVALTNINGSLOVEN_35 = '13',
  BESLUTNING_IKKE_OMGJOERE = '14',
  STADFESTET_ANNEN_BEGRENNELSE = '15',
  HENLAGT = '16',
  INNSTILLING_GJENOPPTAS_VEDTAK_STADFESTES = '17',
  INNSTILLING_GJENOPPTAS_IKKE = '18',
  GJENOPPTATT_DELVIS_FULLT_MEDHOLD = '19',
  GJENOPPTATT_OPPHEVET = '20',
  GJENOPPTATT_STADFESTET = '21',
  IKKE_GJENOPPTATT = '22',
}

export const UTFALL = Object.values(Utfall);

export const OMGJØRINGSUTFALL: Utfall[] = [Utfall.OPPHEVET, Utfall.MEDHOLD, Utfall.DELVIS_MEDHOLD];
export const IKKE_OMGJØRINGSUTFALL: Utfall[] = UTFALL.filter((u) => !OMGJØRINGSUTFALL.includes(u));

export enum AnkeITRUtfall {
  OPPHEVET = '3',
  MEDHOLD = '4',
  DELVIS_MEDHOLD = '5',
  STADFESTET = '6',
  AVVIST = '8',
  HEVET = '11',
  HENVIST = '12',
}

export const ANKE_I_TR_UTFALL = Object.values(AnkeITRUtfall);
export const ANKE_I_TR_OMGJØRINGSUTFALL: AnkeITRUtfall[] = [
  AnkeITRUtfall.OPPHEVET,
  AnkeITRUtfall.MEDHOLD,
  AnkeITRUtfall.DELVIS_MEDHOLD,
];
export const ANKE_I_TR_IKKE_OMGJØRINGSUTFALL: AnkeITRUtfall[] = ANKE_I_TR_UTFALL.filter(
  (u) => !ANKE_I_TR_OMGJØRINGSUTFALL.includes(u),
);

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

export type RegistreringshjemlerMap = Record<string, { lovkilde: IKodeverkValue; hjemmelnavn: string }>;

export interface BaseBehandling<T extends Sakstype = Sakstype> {
  id: string;
  mottattKlageinstans: string;
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

export interface Resultat<U = Utfall> {
  utfallId: U;
  registreringshjemmelIdList: string[];
}

export interface Avsluttet {
  avsluttetAvSaksbehandlerDate: string;
  /** Days */
  behandlingstid: number;
}

export interface Ferdigstilt {
  tildeltEnhet: string;
  isTildelt: true;
  sattPaaVentReasonId: never;
  resultat: Resultat;
}

export interface Frist {
  frist: string | null;
  varsletFrist: string | null;
}

// Klage
export type KlageLedig = BaseBehandling<Sakstype.KLAGE> & Ledig & Frist;
export type KlageTildelt = BaseBehandling<Sakstype.KLAGE> & Tildelt & Frist;
export type KlageFerdigstilt = BaseBehandling<Sakstype.KLAGE> & Ferdigstilt & Avsluttet & Frist;

export type KlagerLedigeResponse = KapteinApiResponse<KlageLedig>;
export type KlagerTildelteResponse = KapteinApiResponse<KlageTildelt>;
export type KlagerFerdigstilteResponse = KapteinApiResponse<KlageFerdigstilt>;

// Anke
export type AnkeLedig = BaseBehandling<Sakstype.ANKE> & Ledig & Frist;
export type AnkeTildelt = BaseBehandling<Sakstype.ANKE> & Tildelt & Frist;
export type AnkeFerdigstilt = BaseBehandling<Sakstype.ANKE> & Ferdigstilt & Avsluttet & Frist;

export type AnkerLedigeResponse = KapteinApiResponse<AnkeLedig>;
export type AnkerTildelteResponse = KapteinApiResponse<AnkeTildelt>;
export type AnkerFerdigstilteResponse = KapteinApiResponse<AnkeFerdigstilt>;

// Behandling etter TR opphevet
export type BetongLedig = BaseBehandling<Sakstype.BEHANDLING_ETTER_TR_OPPHEVET> & Ledig & Frist;
export type BetongTildelt = BaseBehandling<Sakstype.BEHANDLING_ETTER_TR_OPPHEVET> & Tildelt & Frist;
export type BetongFerdigstilt = BaseBehandling<Sakstype.BEHANDLING_ETTER_TR_OPPHEVET> & Ferdigstilt & Avsluttet & Frist;

export type BetongLedigeResponse = KapteinApiResponse<BetongLedig>;
export type BetongTildelteResponse = KapteinApiResponse<BetongTildelt>;
export type BetongFerdigstilteResponse = KapteinApiResponse<BetongFerdigstilt>;

// Omgjøringskrav
export type OmgjøringskravLedig = BaseBehandling<Sakstype.OMGJØRINGSKRAV> & Ledig & Frist;
export type OmgjøringskravTildelt = BaseBehandling<Sakstype.OMGJØRINGSKRAV> & Tildelt & Frist;
export type OmgjøringskravFerdigstilt = BaseBehandling<Sakstype.OMGJØRINGSKRAV> & Ferdigstilt & Avsluttet & Frist;

export type OmgjøringskravLedigeResponse = KapteinApiResponse<OmgjøringskravLedig>;
export type OmgjøringskravTildelteResponse = KapteinApiResponse<OmgjøringskravTildelt>;
export type OmgjøringskravFerdigstilteResponse = KapteinApiResponse<OmgjøringskravFerdigstilt>;

// Anke i Trygderetten
export interface BaseAnkeITR extends BaseBehandling<Sakstype.ANKE_I_TRYGDERETTEN> {
  previousRegistreringshjemmelIdList: string[] | null;
  sendtTilTR: string;
  isTildelt: boolean;
  tildeltEnhet: string | null;
  avsluttetAvSaksbehandlerDate?: string;
}

export type AnkeITRLedig = BaseAnkeITR & {
  isTildelt: false;
  tildeltEnhet: string | null; // Is null for old migrated cases where the previous case is not known or possible to deduct.
};
export type AnkeITRTildelt = BaseAnkeITR & {
  isTildelt: true;
  tildeltEnhet: string;
};
export type AnkeITRFerdigstilt = BaseAnkeITR &
  Avsluttet & {
    isTildelt: true;
    tildeltEnhet: string;
    resultat: Resultat<AnkeITRUtfall> | null;
  };

export type AnkerITRLedigeResponse = KapteinApiResponse<AnkeITRLedig>;
export type AnkerITRTildelteResponse = KapteinApiResponse<AnkeITRTildelt>;
export type AnkerITRFerdigstilteResponse = KapteinApiResponse<AnkeITRFerdigstilt>;

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
  BEGJÆRING_OM_GJENOPPTAK = '6',
  BEGJÆRING_OM_GJENOPPTAK_I_TRYGDERETTEN = '7',
}

export enum PåVentReason {
  VENTER_PAA_TILSVAR = '1',
  VENTER_PAA_DOKUMENTASJON = '2',
  VENTER_PAA_AVKLARING_OM_DOEDSBO = '3',
  SATT_I_BERO = '4',
  ANNET_TIL_FORELEGGELSE = '6',
  ANNET = '5',
}

export interface SakstypeToUtfall extends IKodeverkSimpleValue<Sakstype> {
  utfall: IKodeverkSimpleValue<Utfall>[];
}

export const isFerdigstilt = (b: BaseBehandling | Avsluttet): b is Avsluttet =>
  'avsluttetAvSaksbehandlerDate' in b && typeof b.avsluttetAvSaksbehandlerDate === 'string';

export type FristBehandling = BaseBehandling & Frist & (Ferdigstilt | Ledig | Tildelt);
export type FerdigstiltBehanding = BaseBehandling & Ferdigstilt;
export type AktivBehandling = BaseBehandling & (Ledig | Tildelt);
export type Behandling = FerdigstiltBehanding | AktivBehandling;
