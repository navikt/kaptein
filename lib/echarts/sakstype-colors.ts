import { ColorToken } from '@/lib/echarts/color-token';
import { Sakstype } from '@/lib/types';

export const SAKSTYPE_COLORS: Record<Sakstype, ColorToken> = {
  [Sakstype.KLAGE]: ColorToken.Purple500,
  [Sakstype.ANKE]: ColorToken.Success500,
  [Sakstype.ANKE_I_TRYGDERETTEN]: ColorToken.Danger500,
  [Sakstype.OMGJØRINGSKRAV]: ColorToken.Info600,
  [Sakstype.BEHANDLING_ETTER_TR_OPPHEVET]: ColorToken.Lime600,
  [Sakstype.BEGJÆRING_OM_GJENOPPTAK]: ColorToken.Warning600,
  [Sakstype.BEGJÆRING_OM_GJENOPPTAK_I_TRYGDERETTEN]: ColorToken.Neutral600,
};
