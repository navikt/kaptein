import { BoxNew, VStack } from '@navikt/ds-react';
import { Klageenheter } from '@/components/filters/klageenheter';
import { Ytelser } from '@/components/filters/ytelser';
import { getKlageenheter, getYtelser } from '@/lib/server/api';

export const Filters = async () => {
  const ytelser = await getYtelser();
  const klageenheter = await getKlageenheter();

  return (
    <VStack asChild gap="2">
      <BoxNew padding="5">
        <Ytelser ytelser={ytelser} />
        <Klageenheter klageenheter={klageenheter} />
      </BoxNew>
    </VStack>
  );
};
