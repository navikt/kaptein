import { BoxNew, VStack } from '@navikt/ds-react';
import { DateRange } from '@/components/filters/date-range';
import { Klageenheter } from '@/components/filters/klageenheter';
import { Sakstyper } from '@/components/filters/sakstyper';
import { Tilbakekreving } from '@/components/filters/tilbakekreving';
import { Tildeling } from '@/components/filters/tildeling';
import { Utfall } from '@/components/filters/utfall';
import { YtelserAndHjemler } from '@/components/filters/ytelser-and.hjemler';
import {
  getKlageenheter,
  getLovkildeToRegistreringshjemler,
  getSakstyper,
  getUtfall,
  getYtelser,
} from '@/lib/server/api';

export const AktiveFilters = async () => {
  const ytelser = await getYtelser();
  const klageenheter = await getKlageenheter();
  const sakstyper = await getSakstyper();
  const lovkildeToRegistreringshjemler = await getLovkildeToRegistreringshjemler();
  const utfall = await getUtfall();

  return (
    <VStack asChild gap="2">
      <BoxNew padding="6">
        <DateRange />
        <Klageenheter klageenheter={klageenheter} />
        <Sakstyper sakstyper={sakstyper} />
        <Utfall utfall={utfall} />
        <YtelserAndHjemler ytelser={ytelser} lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler} />
        <Tildeling />
        <Tilbakekreving />
      </BoxNew>
    </VStack>
  );
};
