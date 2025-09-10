import { Reset } from '@/app/ferdigstilte/reset';
import { DateRange } from '@/components/filters/date-range';
import { FilterWrapper } from '@/components/filters/filter-wrapper';
import { SakstyperAndUtfall } from '@/components/filters/sakstyper-and-utfall';
import { Tilbakekreving } from '@/components/filters/tilbakekreving';
import { YtelserAndRegistreringshjemler } from '@/components/filters/ytelser-and-hjemler/ytelser-and.hjemler';
import { getLovkildeToRegistreringshjemler, getSakstyperToUtfall, getYtelser } from '@/lib/server/api';

export const Filters = async () => {
  const ytelser = await getYtelser();
  const lovkildeToRegistreringshjemler = await getLovkildeToRegistreringshjemler();
  const sakstyperToUtfall = await getSakstyperToUtfall();

  return (
    <FilterWrapper>
      <Reset />
      <DateRange />
      <SakstyperAndUtfall sakstyperToUtfall={sakstyperToUtfall} />
      <YtelserAndRegistreringshjemler
        ytelser={ytelser}
        lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler}
      />
      <Tilbakekreving />
    </FilterWrapper>
  );
};
