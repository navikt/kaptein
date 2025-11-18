import { HStack, VStack } from '@navikt/ds-react';
import { Suspense } from 'react';
import { ActiveFilters } from '@/components/filters/active-filters';
import { FilterWrapper } from '@/components/filters/filter-wrapper';
import { Klageenheter } from '@/components/filters/klageenheter';
import { Reset } from '@/components/filters/reset';
import { ResetCacheButton } from '@/components/filters/reset-cache';
import { Sakstyper } from '@/components/filters/sakstyper';
import { HelpForFerdigstilte, Tilbakekreving } from '@/components/filters/tilbakekreving';
import { YtelserAndInnsendingsAndRegistreringshjemler } from '@/components/filters/ytelser-and-hjemler/ytelser-and.hjemler';
import {
  getInnsendingshjemlerMap,
  getKlageenheter,
  getLovkildeToRegistreringshjemler,
  getRegistreringshjemlerMap,
  getTRSaksttyper,
  getYtelser,
} from '@/lib/server/api';
import type { IKodeverkSimpleValue, IKodeverkValue, IYtelse, RegistreringshjemlerMap, Sakstype } from '@/lib/types';

export const Filters = async () => (
  <Suspense fallback={<RenderFilters />}>
    <AsyncFilters />
  </Suspense>
);

const AsyncFilters = async () => {
  const ytelser = await getYtelser();
  const lovkildeToRegistreringshjemler = await getLovkildeToRegistreringshjemler();
  const klageEnheter = await getKlageenheter();
  const registreringshjemler = await getRegistreringshjemlerMap();
  const innsendingshjemler = await getInnsendingshjemlerMap();
  const sakstyper = await getTRSaksttyper();

  return (
    <RenderFilters
      ytelser={ytelser}
      lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler}
      klageenheter={klageEnheter}
      registreringshjemler={registreringshjemler}
      innsendingshjemler={innsendingshjemler}
      sakstyper={sakstyper}
    />
  );
};

interface Props {
  ytelser?: IYtelse[];
  lovkildeToRegistreringshjemler?: IKodeverkValue<string>[];
  klageenheter?: IKodeverkSimpleValue<string>[];
  registreringshjemler?: RegistreringshjemlerMap;
  innsendingshjemler?: Record<string, string>;
  sakstyper?: IKodeverkSimpleValue<Sakstype>[];
}

const RenderFilters = ({
  ytelser,
  lovkildeToRegistreringshjemler,
  klageenheter,
  registreringshjemler,
  innsendingshjemler,
  sakstyper,
}: Props) => (
  <FilterWrapper>
    <VStack gap="4" flexGrow="1">
      <HStack justify="space-between" gap="4" wrap={false}>
        <Reset />
        <ResetCacheButton />
      </HStack>

      <Klageenheter klageenheter={klageenheter} />
      <Sakstyper sakstyper={sakstyper} />

      <YtelserAndInnsendingsAndRegistreringshjemler
        ytelser={ytelser}
        lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler}
      />
    </VStack>

    <VStack gap="4" flexGrow="1">
      <Tilbakekreving help={<HelpForFerdigstilte />} />
      <ActiveFilters
        ytelser={ytelser}
        klageenheter={klageenheter}
        registreringshjemler={registreringshjemler}
        innsendingshjemler={innsendingshjemler}
        sakstyper={sakstyper}
      />
    </VStack>
  </FilterWrapper>
);
