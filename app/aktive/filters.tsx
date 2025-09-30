import { Suspense } from 'react';
import { Reset } from '@/app/aktive/reset';
import { FilterWrapper } from '@/components/filters/filter-wrapper';
import { Klageenheter } from '@/components/filters/klageenheter';
import { Sakstyper } from '@/components/filters/sakstyper';
import { HelpForAktive, Tilbakekreving } from '@/components/filters/tilbakekreving';
import { Tildeling } from '@/components/filters/tildeling';
import { YtelserAndInnsendingshjemler } from '@/components/filters/ytelser-and-hjemler/ytelser-and.hjemler';
import { getInnsendingshjemlerMap, getKlageenheter, getSakstyper, getYtelser } from '@/lib/server/api';
import type { IKodeverkSimpleValue, IYtelse, Sakstype } from '@/lib/types';

export const Filters = async () => (
  <Suspense fallback={<RenderFilters />}>
    <AsyncFilters />
  </Suspense>
);

const AsyncFilters = async () => {
  const ytelser = await getYtelser();
  const klageenheter = await getKlageenheter();
  const sakstyper = await getSakstyper();
  const innsendingshjemlerMap = await getInnsendingshjemlerMap();

  return (
    <RenderFilters
      ytelser={ytelser}
      innsendingshjemlerMap={innsendingshjemlerMap}
      klageenheter={klageenheter}
      sakstyper={sakstyper}
    />
  );
};

interface Props {
  ytelser?: IYtelse[];
  innsendingshjemlerMap?: Record<string, string>;
  klageenheter?: IKodeverkSimpleValue<string>[];
  sakstyper?: IKodeverkSimpleValue<Sakstype>[];
}

const RenderFilters = ({ ytelser = [], innsendingshjemlerMap = {}, klageenheter = [], sakstyper = [] }: Props) => (
  <FilterWrapper>
    <Reset />
    <Klageenheter klageenheter={klageenheter} />
    <Sakstyper sakstyper={sakstyper} />
    <YtelserAndInnsendingshjemler ytelser={ytelser} />
    <Tildeling />
    <Tilbakekreving help={<HelpForAktive innsendingshjemlerMap={innsendingshjemlerMap} />} />
  </FilterWrapper>
);
