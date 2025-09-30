'use client';

import { useMemo } from 'react';
import { AppTheme, useAppTheme } from '@/lib/app-theme';
import { DARK } from '@/lib/echarts/dark';
import { LIGHT } from '@/lib/echarts/light';
import { SAKSTYPE_COLORS } from '@/lib/echarts/sakstype-colors';
import type { BaseBehandling } from '@/lib/types';

// Due to a bug in pie chart when hovering (emphasis) we have to hard code the colors instead of using tokens
export const useSakstypeColor = (behandlinger: Pick<BaseBehandling, 'typeId'>[]) => {
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
