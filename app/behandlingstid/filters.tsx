import { HStack, VStack } from '@navikt/ds-react';
import { Suspense } from 'react';
import { ActiveFilters } from '@/components/filters/active-filters';
import { DateRange } from '@/components/filters/date-range';
import { FilterWrapper } from '@/components/filters/filter-wrapper';
import { Klageenheter } from '@/components/filters/klageenheter';
import { Reset } from '@/components/filters/reset';
import { ResetCacheButton } from '@/components/filters/reset-cache';
import { SakstyperAndUtfall } from '@/components/filters/sakstyper-and-utfall';
import { HelpForFerdigstilte, Tilbakekreving } from '@/components/filters/tilbakekreving';
import { YtelserAndRegistreringshjemler } from '@/components/filters/ytelser-and-hjemler/ytelser-and.hjemler';
import {
  getDefaultSakstyperToUtfall,
  getKlageenheter,
  getLovkildeToRegistreringshjemler,
  getRegistreringshjemlerMap,
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
  const sakstyperToUtfall = await getDefaultSakstyperToUtfall();
  const klageEnheter = await getKlageenheter();
  const utfall = await getUtfall();
  const registreringshjemler = await getRegistreringshjemlerMap();

  return (
    <RenderFilters
      ytelser={ytelser}
      lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler}
      sakstyperToUtfall={sakstyperToUtfall}
      klageenheter={klageEnheter}
      utfall={utfall}
      registreringshjemlerMap={registreringshjemler}
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
}

const RenderFilters = ({
  ytelser,
  lovkildeToRegistreringshjemler,
  sakstyperToUtfall,
  klageenheter,
  utfall,
  registreringshjemlerMap,
}: Props) => (
  <FilterWrapper>
    <VStack gap="4" flexGrow="1">
      <HStack justify="space-between" gap="4" wrap={false}>
        <Reset />
        <ResetCacheButton />
      </HStack>
      <DateRange />
    </VStack>

    <VStack gap="4" flexGrow="1">
      <Klageenheter klageenheter={klageenheter} />
      <SakstyperAndUtfall sakstyperToUtfall={sakstyperToUtfall} />
      <YtelserAndRegistreringshjemler
        ytelser={ytelser}
        lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler}
      />
    </VStack>

    <VStack gap="4" flexGrow="2" width="100%">
      <Tilbakekreving help={<HelpForFerdigstilte />} />
      <ActiveFilters
        ytelser={ytelser}
        klageenheter={klageenheter}
        sakstyper={sakstyperToUtfall}
        utfall={utfall}
        registreringshjemler={registreringshjemlerMap}
      />
    </VStack>
  </FilterWrapper>
);
