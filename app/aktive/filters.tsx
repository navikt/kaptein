import { Reset } from '@/app/aktive/reset';
import { FilterWrapper } from '@/components/filters/filter-wrapper';
import { Klageenheter } from '@/components/filters/klageenheter';
import { Sakstyper } from '@/components/filters/sakstyper';
import { Tilbakekreving } from '@/components/filters/tilbakekreving';
import { Tildeling } from '@/components/filters/tildeling';
import { YtelserAndInnsendingshjemler } from '@/components/filters/ytelser-and-hjemler/ytelser-and.hjemler';
import { getKlageenheter, getSakstyper, getYtelser } from '@/lib/server/api';

export const Filters = async () => {
  const ytelser = await getYtelser();
  const klageenheter = await getKlageenheter();
  const sakstyper = await getSakstyper();

  return (
    <FilterWrapper>
      <Reset />
      <Klageenheter klageenheter={klageenheter} />
      <Sakstyper sakstyper={sakstyper} />
      <YtelserAndInnsendingshjemler ytelser={ytelser} />
      <Tildeling />
      <Tilbakekreving />
    </FilterWrapper>
  );
};
