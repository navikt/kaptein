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

/*
val id: String,
val created: LocalDateTime,
val typeId: String,
val ytelseId: String,
val ageKA: Int,
val innsendingshjemmelIdList: List<String>,
val tilbakekreving: Boolean,

data class BehandlingFinishedView(
    val avsluttetAvSaksbehandlerDate: LocalDate,
    val tildeltEnhet: String,
    val frist: LocalDate?,
    val resultat: VedtakView,
    val varsletFrist: LocalDate?,
)

data class BehandlingActiveView(
    val isTildelt: Boolean,
    val tildeltEnhet: String?,
    val frist: LocalDate?,
    val sattPaaVent: SattPaaVent?,
    val varsletFrist: LocalDate?,
) {
    data class SattPaaVent(
        val reasonId: String,
    )
}

data class TRBehandlingFinishedView(    
    val avsluttetAvSaksbehandlerDate: LocalDate,
    val tildeltEnhet: String,
    val previousRegistreringshjemmelIdList: List<String>,
    val resultat: VedtakView,
    val sendtTilTR: LocalDate,
    val mottattFraTR: LocalDate,
)

data class TRBehandlingActiveView(
    val tildeltEnhet: String,
    val previousRegistreringshjemmelIdList: List<String>,
    val sendtTilTR: LocalDate,
)
*/

export interface BaseBehandling {
  id: string;
  created: string;
  typeId: Sakstype;
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

export type KlageLedig = BaseBehandling & Ledig & Frist;
export type AnkeLedig = BaseBehandling & Ledig & Frist;
export type KlageTildelt = BaseBehandling & Tildelt & Frist;
export type AnkeTildelt = BaseBehandling & Tildelt & Frist;
export type KlageFerdigstilt = BaseBehandling & Ferdigstilt & Frist;
export type AnkeFerdigstilt = BaseBehandling & Ferdigstilt & Frist;

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

export type KlagerLedigeResponse = KapteinApiResponse<KlageLedig>;
export type AnkerLedigeResponse = KapteinApiResponse<AnkeLedig>;
export type KlagerTildelteResponse = KapteinApiResponse<KlageTildelt>;
export type AnkerTildelteResponse = KapteinApiResponse<AnkeTildelt>;
export type KlagerFerdigstilteResponse = KapteinApiResponse<KlageFerdigstilt>;
export type AnkerFerdigstilteResponse = KapteinApiResponse<AnkeFerdigstilt>;

interface MaybeFerdigstilt {
  avsluttetAvSaksbehandlerDate?: string;
  resultat?: {
    utfallId: string;
    registreringshjemmelIdList: string[];
  };
}

export const isFerdigstilt = (behandling: MaybeFerdigstilt): behandling is Ferdigstilt =>
  'avsluttetAvSaksbehandlerDate' in behandling;
