import { AppTheme, useAppTheme } from '@/lib/app-theme';
import { ColorToken } from '@/lib/echarts/color-token';
import { DARK } from '@/lib/echarts/dark';
import { LIGHT } from '@/lib/echarts/light';

const getTheme = (theme: AppTheme) => {
  switch (theme) {
    case AppTheme.LIGHT:
      return LIGHT;
    case AppTheme.DARK:
      return DARK;
  }
};

export enum ExceededFrist {
  EXCEEDED = 'Overskredet',
  NOT_EXCEEDED = 'Innenfor',
  NULL = 'Ikke satt',
}

// Due to a bug in pie chart when hovering (emphasis) we have to hard code the colors instead of using tokens
export const useFristPieChartColors = (data: { name: string }[]) => {
  const themeName = useAppTheme();
  const theme = getTheme(themeName);

  return data.map(({ name }) => {
    switch (name) {
      case ExceededFrist.EXCEEDED:
        return theme[ColorToken.Danger600];
      case ExceededFrist.NOT_EXCEEDED:
        return theme[ColorToken.Accent500];
      case ExceededFrist.NULL:
        return theme[ColorToken.Neutral400];
      default:
        return theme[ColorToken.Warning500];
    }
  });
};

export const getFristColor = (exceededFrist: ExceededFrist) => {
  switch (exceededFrist) {
    case ExceededFrist.EXCEEDED:
      return 'var(--ax-danger-600)';
    case ExceededFrist.NOT_EXCEEDED:
      return 'var(--ax-accent-500)';
    case ExceededFrist.NULL:
      return 'var(--ax-neutral-400)';
  }
};
