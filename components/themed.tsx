'use client';

import { Theme } from '@navikt/ds-react';
import { useAppTheme } from '@/lib/app-theme';

export const Themed = ({ children }: { children: React.ReactNode }) => {
  const theme = useAppTheme();

  return <Theme theme={theme}>{children}</Theme>;
};
