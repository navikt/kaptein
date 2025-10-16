import { HStack } from '@navikt/ds-react';
import { Suspense } from 'react';
import { Reset } from '@/app/aktive-anker-i-tr/reset';
import { ActiveFilters } from '@/components/filters/active-filters';
import { FilterWrapper } from '@/components/filters/filter-wrapper';
import { Klageenheter } from '@/components/filters/klageenheter';
import { ResetCacheButton } from '@/components/filters/reset-cache';
import { HelpForFerdigstilte, Tilbakekreving } from '@/components/filters/tilbakekreving';
import { YtelserAndInnsendingsAndRegistreringshjemler } from '@/components/filters/ytelser-and-hjemler/ytelser-and.hjemler';
import {
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

  return (
    <RenderFilters
      ytelser={ytelser}
      lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler}
      klageenheter={klageEnheter}
      registreringshjemler={registreringshjemler}
    />
  );
};

interface Props {
  ytelser?: IYtelse[];
  lovkildeToRegistreringshjemler?: IKodeverkValue<string>[];
  klageenheter?: IKodeverkSimpleValue<string>[];
  registreringshjemler?: RegistreringshjemlerMap;
}

const RenderFilters = ({
  ytelser = [],
  lovkildeToRegistreringshjemler = [],
  klageenheter = [],
  registreringshjemler = {},
}: Props) => (
  <FilterWrapper>
    <HStack justify="space-between">
      <Reset />
      <ResetCacheButton />
    </HStack>
    <Klageenheter klageenheter={klageenheter} />
    <YtelserAndInnsendingsAndRegistreringshjemler
      ytelser={ytelser}
      lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler}
    />
    <Tilbakekreving help={<HelpForFerdigstilte />} />
    <ActiveFilters ytelser={ytelser} klageenheter={klageenheter} registreringshjemler={registreringshjemler} />
  </FilterWrapper>
);
