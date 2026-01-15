import { HStack, VStack } from '@navikt/ds-react';
import { Suspense } from 'react';
import { ActiveFilters } from '@/components/filters/active-filters';
import { DateRange } from '@/components/filters/date-range';
import { FilterWrapper } from '@/components/filters/filter-wrapper';
import { Klageenheter } from '@/components/filters/klageenheter';
import { Reset } from '@/components/filters/reset';
import { ResetCacheButton } from '@/components/filters/reset-cache';
import { KaSakstyper } from '@/components/filters/sakstyper';
import { HelpForFerdigstilte, Tilbakekreving } from '@/components/filters/tilbakekreving';
import { Tildeling } from '@/components/filters/tildeling';
import { YtelserAndInnsendingshjemler } from '@/components/filters/ytelser-and-hjemler/ytelser-and.hjemler';
import {
  getDefaultSakstyper,
  getInnsendingshjemlerMap,
  getKlageenheter,
  getRegistreringshjemlerMap,
  getYtelser,
} from '@/lib/server/api';
import type { IKodeverkSimpleValue, IYtelse, RegistreringshjemlerMap, Sakstype } from '@/lib/types';

export const Filters = async () => (
  <Suspense fallback={<RenderFilters />}>
    <AsyncFilters />
  </Suspense>
);

const AsyncFilters = async () => {
  const ytelser = await getYtelser();
  const klageEnheter = await getKlageenheter();
  const registreringshjemler = await getRegistreringshjemlerMap();
  const innsendingshjemler = await getInnsendingshjemlerMap();
  const sakstyper = await getDefaultSakstyper();

  return (
    <RenderFilters
      ytelser={ytelser}
      klageenheter={klageEnheter}
      registreringshjemlerMap={registreringshjemler}
      innsendingshjemlerMap={innsendingshjemler}
      sakstyper={sakstyper}
    />
  );
};

interface Props {
  ytelser?: IYtelse[];
  klageenheter?: IKodeverkSimpleValue<string>[];
  registreringshjemlerMap?: RegistreringshjemlerMap;
  innsendingshjemlerMap?: Record<string, string>;
  sakstyper?: IKodeverkSimpleValue<Sakstype>[];
}

const RenderFilters = ({ ytelser, klageenheter, registreringshjemlerMap, innsendingshjemlerMap, sakstyper }: Props) => (
  <FilterWrapper>
    <VStack gap="space-16" flexGrow="1">
      <HStack justify="space-between" gap="space-16" wrap={false}>
        <Reset />
        <ResetCacheButton />
      </HStack>
      <DateRange />
    </VStack>

    <VStack gap="space-16" flexGrow="1">
      <Klageenheter klageenheter={klageenheter} />
      <KaSakstyper sakstyper={sakstyper} />
      <YtelserAndInnsendingshjemler ytelser={ytelser} />
      <Tildeling />
    </VStack>

    <VStack gap="space-16" flexGrow="2" width="100%">
      <Tilbakekreving help={<HelpForFerdigstilte />} />
      <ActiveFilters
        ytelser={ytelser}
        klageenheter={klageenheter}
        sakstyper={sakstyper}
        registreringshjemler={registreringshjemlerMap}
        innsendingshjemler={innsendingshjemlerMap}
      />
    </VStack>
  </FilterWrapper>
);
