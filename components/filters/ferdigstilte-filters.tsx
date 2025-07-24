import { BoxNew, VStack } from '@navikt/ds-react';
import { Sakstyper } from '@/components/filters/sakstyper';
import { YtelserAndHjemler } from '@/components/filters/ytelser-and.hjemler';
import { getSakstyper, getYtelser } from '@/lib/server/api';

export const FerdigstilteFilters = async () => {
  const ytelser = await getYtelser();
  const sakstyper = await getSakstyper();

  return (
    <VStack asChild gap="2">
      <BoxNew padding="6">
        <YtelserAndHjemler ytelser={ytelser} />
        <Sakstyper sakstyper={sakstyper} />
      </BoxNew>
    </VStack>
  );
};
