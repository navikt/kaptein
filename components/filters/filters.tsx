import { BoxNew, VStack } from '@navikt/ds-react';
import { Klageenheter } from '@/components/filters/klageenheter';
import { YtelserAndHjemler } from '@/components/filters/ytelser-and.hjemler';
import { getKlageenheter, getYtelser } from '@/lib/server/api';

export const Filters = async () => {
  const ytelser = await getYtelser();
  const klageenheter = await getKlageenheter();

  return (
    <VStack asChild gap="2">
      <BoxNew padding="5">
        <YtelserAndHjemler ytelser={ytelser} />
        <Klageenheter klageenheter={klageenheter} />
      </BoxNew>
    </VStack>
  );
};
