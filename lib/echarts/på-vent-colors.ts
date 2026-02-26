import { ColorToken } from '@/lib/echarts/color-token';
import { type PåVentReason, PåVentReasonCommon, PåVentReasonKa, PåVentReasonTr } from '@/lib/types';

const PÅ_VENT_COLORS_COMMON: Record<PåVentReasonCommon, ColorToken> = {
  [PåVentReasonCommon.SATT_I_BERO]: ColorToken.Magenta500,
  [PåVentReasonCommon.ANNET]: ColorToken.Purple500,
};

const PÅ_VENT_COLORS_KA: Record<PåVentReasonKa, ColorToken> = {
  [PåVentReasonKa.VENTER_PAA_TILSVAR]: ColorToken.Accent500,
  [PåVentReasonKa.VENTER_PAA_DOKUMENTASJON]: ColorToken.Warning500,
  [PåVentReasonKa.VENTER_PAA_AVKLARING_OM_DOEDSBO]: ColorToken.Danger500,
  [PåVentReasonKa.ANNET_TIL_FORELEGGELSE]: ColorToken.Neutral500,
  [PåVentReasonKa.VENTER_PAA_UTFYLLENDE_KLAGE]: ColorToken.Lime500,
  [PåVentReasonKa.VENTER_PAA_UTFYLLENDE_ANKE]: ColorToken.Beige500,
};

const PÅ_VENT_TR_COLORS_TR: Record<PåVentReasonTr, ColorToken> = {
  [PåVentReasonTr.VENTER_PAA_AVGJOERELSE_OM_SOEKSMAAL_GJENOPPTAKSBEGJAERING]: ColorToken.Accent500,
  [PåVentReasonTr.UTREDER_FOR_TRYGDERETTEN]: ColorToken.Warning500,
};

export const PÅ_VENT_COLORS: Record<PåVentReason, ColorToken> = {
  ...PÅ_VENT_COLORS_COMMON,
  ...PÅ_VENT_COLORS_KA,
  ...PÅ_VENT_TR_COLORS_TR,
};
