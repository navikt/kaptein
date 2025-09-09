import { FilterWrapper } from '@/components/filters/filter-wrapper';
import { Klageenheter } from '@/components/filters/klageenheter';
import { Sakstyper } from '@/components/filters/sakstyper';
import { Tilbakekreving } from '@/components/filters/tilbakekreving';
import { Tildeling } from '@/components/filters/tildeling';
import { Utfall } from '@/components/filters/utfall';
import { YtelserAndInnsendingshjemler } from '@/components/filters/ytelser-and-hjemler/ytelser-and.hjemler';
import { getKlageenheter, getSakstyper, getUtfall, getYtelser } from '@/lib/server/api';

export const Filters = async () => {
  const ytelser = await getYtelser();
  const klageenheter = await getKlageenheter();
  const sakstyper = await getSakstyper();
  const utfall = await getUtfall();

  return (
    <FilterWrapper>
      <Klageenheter klageenheter={klageenheter} />
      <Sakstyper sakstyper={sakstyper} />
      <Utfall utfall={utfall} />
      <YtelserAndInnsendingshjemler ytelser={ytelser} />
      <Tildeling />
      <Tilbakekreving />
    </FilterWrapper>
  );
};
