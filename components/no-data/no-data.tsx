import { Alert, VStack } from '@navikt/ds-react';

export const NoData = () => (
  <VStack align="center" justify="center" className="h-full">
    <Alert variant="info">Ingen data</Alert>
  </VStack>
);
