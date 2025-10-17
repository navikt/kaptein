import { HStack } from '@navikt/ds-react';
import { Suspense } from 'react';
import { Reset } from '@/app/ferdigstilte/reset';
import { ActiveFilters } from '@/components/filters/active-filters';
import { DateRange } from '@/components/filters/date-range';
import { FilterWrapper } from '@/components/filters/filter-wrapper';
import { Klageenheter } from '@/components/filters/klageenheter';
import { ResetCacheButton } from '@/components/filters/reset-cache';
import { SakstyperAndUtfall } from '@/components/filters/sakstyper-and-utfall';
import { HelpForFerdigstilte, Tilbakekreving } from '@/components/filters/tilbakekreving';
import { Tildeling } from '@/components/filters/tildeling';
import { YtelserAndAllHjemler } from '@/components/filters/ytelser-and-hjemler/ytelser-and.hjemler';
import {
  getInnsendingshjemlerMap,
  getKlageenheter,
  getLovkildeToRegistreringshjemler,
  getRegistreringshjemlerMap,
  getRelevantSakstyperToUtfall,
  getUtfall,
  getYtelser,
} from '@/lib/server/api';
import type {
  IKodeverkSimpleValue,
  IKodeverkValue,
  IYtelse,
  RegistreringshjemlerMap,
  SakstypeToUtfall,
} from '@/lib/types';

export const Filters = async () => (
  <Suspense fallback={<RenderFilters />}>
    <AsyncFilters />
  </Suspense>
);

const AsyncFilters = async () => {
  const ytelser = await getYtelser();
  const lovkildeToRegistreringshjemler = await getLovkildeToRegistreringshjemler();
  const sakstyperToUtfall = await getRelevantSakstyperToUtfall();
  const klageEnheter = await getKlageenheter();
  const utfall = await getUtfall();
  const registreringshjemler = await getRegistreringshjemlerMap();
  const innsendingshjemler = await getInnsendingshjemlerMap();

  return (
    <RenderFilters
      ytelser={ytelser}
      lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler}
      sakstyperToUtfall={sakstyperToUtfall}
      klageenheter={klageEnheter}
      utfall={utfall}
      registreringshjemlerMap={registreringshjemler}
      innsendingshjemlerMap={innsendingshjemler}
    />
  );
};

interface Props {
  ytelser?: IYtelse[];
  lovkildeToRegistreringshjemler?: IKodeverkValue<string>[];
  sakstyperToUtfall?: SakstypeToUtfall[];
  klageenheter?: IKodeverkSimpleValue<string>[];
  utfall?: IKodeverkSimpleValue<string>[];
  registreringshjemlerMap?: RegistreringshjemlerMap;
  innsendingshjemlerMap?: Record<string, string>;
}

const RenderFilters = ({
  ytelser = [],
  lovkildeToRegistreringshjemler = [],
  sakstyperToUtfall = [],
  klageenheter = [],
  utfall = [],
  registreringshjemlerMap = {},
  innsendingshjemlerMap = {},
}: Props) => (
  <FilterWrapper>
    <HStack justify="space-between">
      <Reset />
      <ResetCacheButton />
    </HStack>
    <DateRange />
    <Klageenheter klageenheter={klageenheter} />
    <SakstyperAndUtfall sakstyperToUtfall={sakstyperToUtfall} />
    <YtelserAndAllHjemler ytelser={ytelser} lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler} />
    <Tildeling />
    <Tilbakekreving help={<HelpForFerdigstilte />} />
    <ActiveFilters
      ytelser={ytelser}
      klageenheter={klageenheter}
      sakstyper={sakstyperToUtfall}
      utfall={utfall}
      registreringshjemler={registreringshjemlerMap}
      innsendingshjemler={innsendingshjemlerMap}
    />
  </FilterWrapper>
);
