import { ChevronRightIcon } from '@navikt/aksel-icons';
import { HStack } from '@navikt/ds-react';

export const SubFilter = ({ children }: { children: React.ReactNode }) => (
  <HStack align="center" className="flex">
    <ChevronRightIcon fontSize={32} aria-hidden />
    {children}
  </HStack>
);
