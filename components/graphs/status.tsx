import { BroadcastIcon } from '@navikt/aksel-icons';
import { BoxNew, Loader, Tooltip, VStack } from '@navikt/ds-react';

interface Props {
  isLoading: boolean;
}

export const GraphStatus = ({ isLoading }: Props) => (
  <BoxNew asChild position="absolute" top="4" left="4">
    <VStack align="center" justify="center" gap="2">
      {isLoading ? (
        <Tooltip content="Oppdaterer...">
          <Loader size="large" />
        </Tooltip>
      ) : (
        <Tooltip content="Grafen blir sanntidsoppdatert">
          <BroadcastIcon aria-hidden fontSize={32} />
        </Tooltip>
      )}
    </VStack>
  </BoxNew>
);
