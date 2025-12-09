import { HStack, VStack } from '@navikt/ds-react';
import { Suspense } from 'react';
import { ActiveFilters } from '@/components/filters/active-filters';
import { FilterWrapper } from '@/components/filters/filter-wrapper';
import { Klageenheter } from '@/components/filters/klageenheter';
import { Reset } from '@/components/filters/reset';
import { ResetCacheButton } from '@/components/filters/reset-cache';
import { KaSakstyper } from '@/components/filters/sakstyper';
import { HelpForAktive, Tilbakekreving } from '@/components/filters/tilbakekreving';
import { Tildeling } from '@/components/filters/tildeling';
import { YtelserAndInnsendingshjemler } from '@/components/filters/ytelser-and-hjemler/ytelser-and.hjemler';
import { getDefaultSakstyper, getInnsendingshjemlerMap, getKlageenheter, getYtelser } from '@/lib/server/api';
import type { IKodeverkSimpleValue, IYtelse, Sakstype } from '@/lib/types';

export const Filters = async () => (
  <Suspense fallback={<RenderFilters />}>
    <AsyncFilters />
  </Suspense>
);

const AsyncFilters = async () => {
  const ytelser = await getYtelser();
  const klageenheter = await getKlageenheter();
  const sakstyper = await getDefaultSakstyper();
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

const RenderFilters = ({ ytelser, innsendingshjemlerMap, klageenheter, sakstyper }: Props) => (
  <FilterWrapper>
    <VStack gap="4" flexGrow="1">
      <HStack justify="space-between" gap="4" wrap={false}>
        <Reset />
        <ResetCacheButton />
      </HStack>
      <Klageenheter klageenheter={klageenheter} />
      <KaSakstyper sakstyper={sakstyper} />
    </VStack>

    <VStack gap="4" flexGrow="1">
      <YtelserAndInnsendingshjemler ytelser={ytelser} />
      <Tildeling />
    </VStack>

    <VStack gap="4" flexGrow="2" width="100%">
      <Tilbakekreving help={<HelpForAktive innsendingshjemlerMap={innsendingshjemlerMap} />} />
      <ActiveFilters
        ytelser={ytelser}
        klageenheter={klageenheter}
        sakstyper={sakstyper}
        innsendingshjemler={innsendingshjemlerMap}
      />
    </VStack>
  </FilterWrapper>
);
