import { AppTheme } from '@/lib/app-theme';
import { DARK } from '@/lib/echarts/dark';
import { LIGHT } from '@/lib/echarts/light';
import { PÅ_VENT_COLORS } from '@/lib/echarts/på-vent-colors';
import { SAKSTYPE_COLORS } from '@/lib/echarts/sakstype-colors';
import type { PåVentReason, Sakstype } from '@/lib/types';

// Due to a bug in pie chart when hovering (emphasis) we have to hard code the colors instead of using tokens
export const getSakstypePieChartColor = (typeId: Sakstype, theme: AppTheme): string => {
  switch (theme) {
    case AppTheme.LIGHT:
      return LIGHT[SAKSTYPE_COLORS[typeId]];
    case AppTheme.DARK:
      return DARK[SAKSTYPE_COLORS[typeId]];
  }
};

// Due to a bug in pie chart when hovering (emphasis) we have to hard code the colors instead of using tokens
export const getPåVentReasonPieChartColor = (reason: PåVentReason, theme: AppTheme): string => {
  switch (theme) {
    case AppTheme.LIGHT:
      return LIGHT[PÅ_VENT_COLORS[reason]];
    case AppTheme.DARK:
      return DARK[PÅ_VENT_COLORS[reason]];
  }
};

export const getSakstypeColor = (typeId: Sakstype) => `var(--ax-${SAKSTYPE_COLORS[typeId]})`;
export const getPåVentReasonColor = (reason: PåVentReason) => `var(--ax-${PÅ_VENT_COLORS[reason]})`;
