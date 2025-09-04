import { Alert, VStack } from '@navikt/ds-react';

export const NoData = () => (
  <VStack align="center" justify="center" className="grow">
    <Alert variant="info">Ingen data</Alert>
  </VStack>
);
