'use client';

import { Theme } from '@navikt/ds-react';
import { useAppTheme } from '@/lib/app-theme';

export const Themed = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const theme = useAppTheme();

  return (
    <Theme className={className} theme={theme}>
      {children}
    </Theme>
  );
};
