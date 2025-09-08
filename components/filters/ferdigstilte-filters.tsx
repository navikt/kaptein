import { BoxNew, VStack } from '@navikt/ds-react';
import { Sakstyper } from '@/components/filters/sakstyper';
import { YtelserAndHjemler } from '@/components/filters/ytelser-and.hjemler';
import { getLovkildeToRegistreringshjemler, getSakstyper, getYtelser } from '@/lib/server/api';

export const FerdigstilteFilters = async () => {
  const ytelser = await getYtelser();
  const sakstyper = await getSakstyper();
  const lovkildeToRegistreringshjemler = await getLovkildeToRegistreringshjemler();

  return (
    <VStack asChild gap="2">
      <BoxNew padding="6">
        <YtelserAndHjemler ytelser={ytelser} lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler} />
        <Sakstyper sakstyper={sakstyper} />
      </BoxNew>
    </VStack>
  );
};
