import { HStack, VStack } from '@navikt/ds-react';
import { Suspense } from 'react';
import { Reset } from '@/app/aktive-anker-i-tr/reset';
import { ActiveFilters } from '@/components/filters/active-filters';
import { FilterWrapper } from '@/components/filters/filter-wrapper';
import { Klageenheter } from '@/components/filters/klageenheter';
import { ResetCacheButton } from '@/components/filters/reset-cache';
import { HelpForFerdigstilte, Tilbakekreving } from '@/components/filters/tilbakekreving';
import { YtelserAndInnsendingsAndRegistreringshjemler } from '@/components/filters/ytelser-and-hjemler/ytelser-and.hjemler';
import {
  getInnsendingshjemlerMap,
  getKlageenheter,
  getLovkildeToRegistreringshjemler,
  getRegistreringshjemlerMap,
  getYtelser,
} from '@/lib/server/api';
import type { IKodeverkSimpleValue, IKodeverkValue, IYtelse, RegistreringshjemlerMap } from '@/lib/types';

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

  return (
    <RenderFilters
      ytelser={ytelser}
      lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler}
      klageenheter={klageEnheter}
      registreringshjemler={registreringshjemler}
      innsendingshjemler={innsendingshjemler}
    />
  );
};

interface Props {
  ytelser?: IYtelse[];
  lovkildeToRegistreringshjemler?: IKodeverkValue<string>[];
  klageenheter?: IKodeverkSimpleValue<string>[];
  registreringshjemler?: RegistreringshjemlerMap;
  innsendingshjemler?: Record<string, string>;
}

const RenderFilters = ({
  ytelser = [],
  lovkildeToRegistreringshjemler = [],
  klageenheter = [],
  registreringshjemler = {},
  innsendingshjemler = {},
}: Props) => (
  <FilterWrapper>
    <VStack gap="4" flexGrow="1">
      <HStack justify="space-between" gap="4" wrap={false}>
        <Reset />
        <ResetCacheButton />
      </HStack>

      <Klageenheter klageenheter={klageenheter} />
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
      />
    </VStack>
  </FilterWrapper>
);
