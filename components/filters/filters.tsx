import { BoxNew, VStack } from '@navikt/ds-react';
import { Klageenheter } from '@/components/filters/klageenheter';
import { Sakstyper } from '@/components/filters/sakstyper';
import { Tildeling } from '@/components/filters/tildeling';
import { YtelserAndHjemler } from '@/components/filters/ytelser-and.hjemler';
import { getKlageenheter, getLovkildeToRegistreringshjemler, getSakstyper, getYtelser } from '@/lib/server/api';

export const Filters = async () => {
  const ytelser = await getYtelser();
  const klageenheter = await getKlageenheter();
  const sakstyper = await getSakstyper();
  const lovkildeToRegistreringshjemler = await getLovkildeToRegistreringshjemler();

  return (
    <VStack asChild gap="2">
      <BoxNew padding="6">
        <YtelserAndHjemler ytelser={ytelser} lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler} />
        <Klageenheter klageenheter={klageenheter} />
        <Sakstyper sakstyper={sakstyper} />
        <Tildeling />
      </BoxNew>
    </VStack>
  );
};
