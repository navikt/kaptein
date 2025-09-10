import { Reset } from '@/app/aktive/reset';
import { FilterWrapper } from '@/components/filters/filter-wrapper';
import { Klageenheter } from '@/components/filters/klageenheter';
import { SakstyperAndUtfall } from '@/components/filters/sakstyper-and-utfall';
import { Tilbakekreving } from '@/components/filters/tilbakekreving';
import { Tildeling } from '@/components/filters/tildeling';
import { YtelserAndInnsendingshjemler } from '@/components/filters/ytelser-and-hjemler/ytelser-and.hjemler';
import { getKlageenheter, getSakstyperToUtfall, getYtelser } from '@/lib/server/api';

export const Filters = async () => {
  const ytelser = await getYtelser();
  const klageenheter = await getKlageenheter();
  const sakstyperToUtfall = await getSakstyperToUtfall();

  return (
    <FilterWrapper>
      <Reset />
      <Klageenheter klageenheter={klageenheter} />
      <SakstyperAndUtfall sakstyperToUtfall={sakstyperToUtfall} />
      <YtelserAndInnsendingshjemler ytelser={ytelser} />
      <Tildeling />
      <Tilbakekreving />
    </FilterWrapper>
  );
};
