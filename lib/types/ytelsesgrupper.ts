import type { IKodeverkSimpleValue } from '@/lib/types';
import { Ytelse } from '@/lib/types/ytelser';

export enum Ytelsesgruppe {
  Bidragsområdet = 'bo',
  Foreldrepenger = 'fp',
  Etterlatteytelser = 'ey',
  GrunnOgHjelpestønad = 'gh',
  Hjelpemidler = 'hm',
  Oppfølgingssak = 'os',
  SupplerendeStønad = 'ss',
  SykdomIFamilien = 'sf',
  Yrkesskade = 'ys',
}

const YTELSESGRUPPE_NAMES: Record<Ytelsesgruppe, string> = {
  [Ytelsesgruppe.Bidragsområdet]: 'Bidragsområdet (ytelsesgruppe)',
  [Ytelsesgruppe.Foreldrepenger]: 'Foreldrepenger (ytelsesgruppe)',
  [Ytelsesgruppe.Etterlatteytelser]: 'Etterlatteytelser (ytelsesgruppe)',
  [Ytelsesgruppe.GrunnOgHjelpestønad]: 'Grunn- og hjelpestønad (ytelsesgruppe)',
  [Ytelsesgruppe.Hjelpemidler]: 'Hjelpemidler (ytelsesgruppe)',
  [Ytelsesgruppe.Oppfølgingssak]: 'Oppfølgingssak (ytelsesgruppe)',
  [Ytelsesgruppe.SupplerendeStønad]: 'Supplerende stønad (ytelsesgruppe)',
  [Ytelsesgruppe.SykdomIFamilien]: 'Sykdom i familien (ytelsesgruppe)',
  [Ytelsesgruppe.Yrkesskade]: 'Yrkesskade (ytelsesgruppe)',
};

export const YTELSESGRUPPE_OPTIONS: { label: string; id: Ytelsesgruppe }[] = Object.entries(YTELSESGRUPPE_NAMES).map(
  ([key, label]) => ({
    label,
    id: key as Ytelsesgruppe,
  }),
);

export const YTELSESGRUPPE_KODEVERK: IKodeverkSimpleValue[] = YTELSESGRUPPE_OPTIONS.map(({ id, label }) => ({
  id,
  navn: label,
}));

export const YTELSESGRUPPER: Record<Ytelsesgruppe, string[]> = {
  [Ytelsesgruppe.Bidragsområdet]: [
    Ytelse.BidragsområdetBarnebidrag,
    Ytelse.BidragsområdetBarnebortføring,
    Ytelse.BidragsområdetBidragsforskudd,
    Ytelse.BidragsområdetBidragsinnkreving,
    Ytelse.BidragsområdetEktefellebidrag,
    Ytelse.BidragsområdetFarOgMorskap,
    Ytelse.BidragsområdetOppfostringsbidrag,
  ],
  [Ytelsesgruppe.Foreldrepenger]: [
    Ytelse.ForeldrepengerEngangsstønad,
    Ytelse.ForeldrepengerForeldrepenger,
    Ytelse.ForeldrepengerSvangerskapspenger,
  ],
  [Ytelsesgruppe.Etterlatteytelser]: [
    Ytelse.EtterlatteYtelserGjenlevende,
    Ytelse.EtterlatteYtelserOmstillingsstønad,
    Ytelse.EtterlatteYtelserBarnepensjon,
  ],
  [Ytelsesgruppe.GrunnOgHjelpestønad]: [Ytelse.GrunnOgHjelpestønadGrunnstønad, Ytelse.GrunnOgHjelpestønadHjelpestønad],
  [Ytelsesgruppe.Hjelpemidler]: [
    Ytelse.HjelpemidlerBilOgMotorkjøretøy,
    Ytelse.HjelpemidlerOrtopediske,
    Ytelse.HjelpemidlerTekniske,
  ],
  [Ytelsesgruppe.Oppfølgingssak]: [Ytelse.OppfølgingssakNavLoven14a, Ytelse.OppfølgingssakTiltaksplass],
  [Ytelsesgruppe.SupplerendeStønad]: [Ytelse.SupplerendeStønad, Ytelse.SupplerendeStønadTilUføreFlyktninger],
  [Ytelsesgruppe.SykdomIFamilien]: [
    Ytelse.SykdomIFamilienOmsorgspenger,
    Ytelse.SykdomIFamilienOpplæringspenger,
    Ytelse.SykdomIFamilienPleiepengerILivetsSluttfase,
    Ytelse.SykdomIFamilienPleiepengerSyktBarn,
  ],
  [Ytelsesgruppe.Yrkesskade]: [
    Ytelse.YrkesskadeMenerstatning,
    Ytelse.YrkesskadeYrkesskade,
    Ytelse.YrkesskadeYrkessykdom,
  ],
};

const YTELSESGRUPPE_VALUES = Object.values(Ytelsesgruppe);

const YTELSESGRUPPE_ENTRIES = Object.entries(YTELSESGRUPPER);

export const isYtelsesgruppe = (key: string): key is Ytelsesgruppe => YTELSESGRUPPE_VALUES.some((v) => v === key);

/** Get the display name for a ytelsesgruppe */
export const getYtelsesgruppeName = (id: Ytelsesgruppe): string => YTELSESGRUPPE_NAMES[id];

/** Get all ytelse IDs that belong to a ytelsesgruppe */
export const getYtelserForGroup = (gruppeId: Ytelsesgruppe): string[] => YTELSESGRUPPER[gruppeId];

/** Find which ytelsesgruppe a ytelse belongs to, if any */
export const getYtelsesgruppeForYtelse = (ytelseId: string): Ytelsesgruppe | null => {
  for (const [gruppeId, ytelser] of YTELSESGRUPPE_ENTRIES) {
    if (ytelser.includes(ytelseId)) {
      return gruppeId as Ytelsesgruppe;
    }
  }
  return null;
};

/** Get all ytelse IDs from selected ytelsesgrupper */
export const expandYtelsesgrupperToYtelser = (gruppeIds: string[]): string[] => {
  const ytelseIds: string[] = [];
  for (const gruppeId of gruppeIds) {
    if (isYtelsesgruppe(gruppeId)) {
      ytelseIds.push(...getYtelserForGroup(gruppeId));
    }
  }
  return [...new Set(ytelseIds)]; // Remove duplicates
};
