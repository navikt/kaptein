import { AppTheme } from '@/lib/app-theme';

interface Data {
  value: number;
  name: string;
}

export interface ThemeColors {
  [AppTheme.LIGHT]: string;
  [AppTheme.DARK]: string;
}

export interface State {
  data: Data[];
  colors: ThemeColors[];
}
