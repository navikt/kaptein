import { Alert, VStack } from '@navikt/ds-react';
import type { ReactNode } from 'react';

export const LoadingError = ({ children }: { children: ReactNode }) => (
  <VStack justify="start" align="center" className="w-full p-6">
    <Alert variant="error">{children}</Alert>
  </VStack>
);
