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
