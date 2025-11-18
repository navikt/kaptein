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
import { Tildeling } from '@/components/filters/tildeling';
import { YtelserAndInnsendingshjemler } from '@/components/filters/ytelser-and-hjemler/ytelser-and.hjemler';
import {
  getDefaultSakstyperToUtfall,
  getInnsendingshjemlerMap,
  getKlageenheter,
  getRegistreringshjemlerMap,
  getUtfall,
  getYtelser,
} from '@/lib/server/api';
import type { IKodeverkSimpleValue, IYtelse, RegistreringshjemlerMap, SakstypeToUtfall } from '@/lib/types';

export const Filters = async () => (
  <Suspense fallback={<RenderFilters />}>
    <AsyncFilters />
  </Suspense>
);

const AsyncFilters = async () => {
  const ytelser = await getYtelser();
  const sakstyperToUtfall = await getDefaultSakstyperToUtfall();
  const klageEnheter = await getKlageenheter();
  const utfall = await getUtfall();
  const registreringshjemler = await getRegistreringshjemlerMap();
  const innsendingshjemler = await getInnsendingshjemlerMap();

  return (
    <RenderFilters
      ytelser={ytelser}
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
  sakstyperToUtfall?: SakstypeToUtfall[];
  klageenheter?: IKodeverkSimpleValue<string>[];
  utfall?: IKodeverkSimpleValue<string>[];
  registreringshjemlerMap?: RegistreringshjemlerMap;
  innsendingshjemlerMap?: Record<string, string>;
}

const RenderFilters = ({
  ytelser,
  sakstyperToUtfall,
  klageenheter,
  utfall,
  registreringshjemlerMap,
  innsendingshjemlerMap,
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
      <YtelserAndInnsendingshjemler ytelser={ytelser} />
      <Tildeling />
    </VStack>

    <VStack gap="4" flexGrow="2" width="100%">
      <Tilbakekreving help={<HelpForFerdigstilte />} />
      <ActiveFilters
        ytelser={ytelser}
        klageenheter={klageenheter}
        sakstyper={sakstyperToUtfall}
        utfall={utfall}
        registreringshjemler={registreringshjemlerMap}
        innsendingshjemler={innsendingshjemlerMap}
      />
    </VStack>
  </FilterWrapper>
);
