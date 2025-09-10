import { Loader, VStack } from '@navikt/ds-react';

export const GraphLoading = () => (
  <VStack width="100%" height="100%" align="center" justify="center" gap="2">
    <Loader size="3xlarge" />
    <span>Laster...</span>
  </VStack>
);
