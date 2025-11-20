import { ColorToken } from '@/lib/echarts/color-token';
import { PåVentReason } from '@/lib/types';

export const PÅ_VENT_COLORS: Record<PåVentReason, ColorToken> = {
  [PåVentReason.VENTER_PAA_TILSVAR]: ColorToken.Accent500,
  [PåVentReason.VENTER_PAA_DOKUMENTASJON]: ColorToken.Warning500,
  [PåVentReason.VENTER_PAA_AVKLARING_OM_DOEDSBO]: ColorToken.Danger500,
  [PåVentReason.SATT_I_BERO]: ColorToken.Magenta500,
  [PåVentReason.ANNET_TIL_FORELEGGELSE]: ColorToken.Neutral500,
  [PåVentReason.ANNET]: ColorToken.Purple500,
  [PåVentReason.VENTER_PAA_UTFYLLENDE_KLAGE]: ColorToken.Lime500,
  [PåVentReason.VENTER_PAA_UTFYLLENDE_ANKE]: ColorToken.Beige500,
};
