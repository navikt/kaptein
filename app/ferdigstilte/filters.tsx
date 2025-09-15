import { Suspense } from 'react';
import { Reset } from '@/app/ferdigstilte/reset';
import { DateRange } from '@/components/filters/date-range';
import { FilterWrapper } from '@/components/filters/filter-wrapper';
import { Klageenheter } from '@/components/filters/klageenheter';
import { SakstyperAndUtfall } from '@/components/filters/sakstyper-and-utfall';
import { HelpForFerdigstilte, Tilbakekreving } from '@/components/filters/tilbakekreving';
import { YtelserAndRegistreringshjemler } from '@/components/filters/ytelser-and-hjemler/ytelser-and.hjemler';
import { getLovkildeToRegistreringshjemler, getSakstyperToUtfall, getYtelser } from '@/lib/server/api';
import type { IKodeverkValue, IYtelse, SakstypeToUtfall } from '@/lib/server/types';

export const Filters = async () => (
  <Suspense fallback={<RenderFilters />}>
    <AsyncFilters />
  </Suspense>
);

const AsyncFilters = async () => {
  const ytelser = await getYtelser();
  const lovkildeToRegistreringshjemler = await getLovkildeToRegistreringshjemler();
  const sakstyperToUtfall = await getSakstyperToUtfall();

  return (
    <RenderFilters
      ytelser={ytelser}
      lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler}
      sakstyperToUtfall={sakstyperToUtfall}
    />
  );
};

interface Props {
  ytelser?: IYtelse[];
  lovkildeToRegistreringshjemler?: IKodeverkValue<string>[];
  sakstyperToUtfall?: SakstypeToUtfall[];
  klageenheter?: IKodeverkValue<string>[];
}

const RenderFilters = ({
  ytelser = [],
  lovkildeToRegistreringshjemler = [],
  sakstyperToUtfall = [],
  klageenheter = [],
}: Props) => (
  <FilterWrapper>
    <Reset />
    <DateRange />
    <Klageenheter klageenheter={klageenheter} />
    <SakstyperAndUtfall sakstyperToUtfall={sakstyperToUtfall} />
    <YtelserAndRegistreringshjemler ytelser={ytelser} lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler} />
    <Tilbakekreving help={<HelpForFerdigstilte />} />
  </FilterWrapper>
);
