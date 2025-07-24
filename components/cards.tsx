import { BoxNew } from '@navikt/ds-react';

export const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <BoxNew padding="4" shadow="dialog" width="640px" height="480px" background="neutral-soft" borderRadius="medium">
      {children}
    </BoxNew>
  );
};
