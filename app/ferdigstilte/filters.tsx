import { DateRange } from '@/components/filters/date-range';
import { FilterWrapper } from '@/components/filters/filter-wrapper';
import { Sakstyper } from '@/components/filters/sakstyper';
import { Tilbakekreving } from '@/components/filters/tilbakekreving';
import { Utfall } from '@/components/filters/utfall';
import { YtelserAndHjemler } from '@/components/filters/ytelser-and-hjemler/ytelser-and.hjemler';
import { getLovkildeToRegistreringshjemler, getSakstyper, getUtfall, getYtelser } from '@/lib/server/api';

export const Filters = async () => {
  const ytelser = await getYtelser();
  const sakstyper = await getSakstyper();
  const lovkildeToRegistreringshjemler = await getLovkildeToRegistreringshjemler();
  const utfall = await getUtfall();

  return (
    <FilterWrapper>
      <DateRange />
      <Sakstyper sakstyper={sakstyper} />
      <Utfall utfall={utfall} />
      <YtelserAndHjemler ytelser={ytelser} lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler} />
      <Tilbakekreving />
    </FilterWrapper>
  );
};
