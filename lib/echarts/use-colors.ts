'use client';

import { useMemo } from 'react';
import { AppTheme, useAppTheme } from '@/lib/app-theme';
import { ColorToken } from '@/lib/echarts/color-token';
import { DARK } from '@/lib/echarts/dark';
import { LIGHT } from '@/lib/echarts/light';
import { type Behandling, Sakstype } from '@/lib/server/types';

export const SAKSTYPE_COLORS: Record<Sakstype, ColorToken> = {
  [Sakstype.KLAGE]: ColorToken.Purple500,
  [Sakstype.ANKE]: ColorToken.Success500,
  [Sakstype.ANKE_I_TRYGDERETTEN]: ColorToken.Danger500,
  [Sakstype.OMGJØRINGSKRAV]: ColorToken.Info600,
  [Sakstype.BEHANDLING_ETTER_TR_OPPHEVET]: ColorToken.Lime600,
};

export const getSakstypeColor = (typeId: Sakstype) => `var(--ax-${SAKSTYPE_COLORS[typeId]})`;

export const useColor = (behandlinger: Behandling[]) => {
  const theme = useAppTheme();

  const relevantSakstyper = useMemo(() => Array.from(new Set(behandlinger.map((b) => b.typeId))), [behandlinger]);

  return useMemo(() => {
    const tokens = relevantSakstyper.map((s) => SAKSTYPE_COLORS[s]);

    switch (theme) {
      case AppTheme.LIGHT:
        return tokens.map((t) => LIGHT[t]);
      case AppTheme.DARK:
        return tokens.map((t) => DARK[t]);
    }
  }, [relevantSakstyper, theme]);
};
