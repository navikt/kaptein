import { HStack } from '@navikt/ds-react';
import { Suspense } from 'react';
import { Reset } from '@/app/ferdigstilte-anker-i-tr/reset';
import { ActiveFilters } from '@/components/filters/active-filters';
import { DateRange } from '@/components/filters/date-range';
import { FilterWrapper } from '@/components/filters/filter-wrapper';
import { Klageenheter } from '@/components/filters/klageenheter';
import { ResetCacheButton } from '@/components/filters/reset-cache';
import { HelpForFerdigstilte, Tilbakekreving } from '@/components/filters/tilbakekreving';
import { UtfallFilter } from '@/components/filters/utfall';
import { YtelserAndInnsendingsAndRegistreringshjemler } from '@/components/filters/ytelser-and-hjemler/ytelser-and.hjemler';
import {
  getKlageenheter,
  getLovkildeToRegistreringshjemler,
  getRegistreringshjemlerMap,
  getSakstyperToUtfall,
  getYtelser,
} from '@/lib/server/api';
import {
  type IKodeverkSimpleValue,
  type IKodeverkValue,
  type IYtelse,
  type RegistreringshjemlerMap,
  Sakstype,
  type SakstypeToUtfall,
  type Utfall,
} from '@/lib/types';

export const Filters = async () => (
  <Suspense fallback={<RenderFilters />}>
    <AsyncFilters />
  </Suspense>
);

const AsyncFilters = async () => {
  const ytelser = await getYtelser();
  const lovkildeToRegistreringshjemler = await getLovkildeToRegistreringshjemler();
  const sakstyperToUtfall = await getSakstyperToUtfall();
  const klageEnheter = await getKlageenheter();
  const registreringshjemler = await getRegistreringshjemlerMap();

  return (
    <RenderFilters
      ytelser={ytelser}
      lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler}
      sakstyperToUtfall={sakstyperToUtfall}
      klageenheter={klageEnheter}
      utfall={sakstyperToUtfall.find((s) => s.id === Sakstype.ANKE_I_TRYGDERETTEN)?.utfall}
      registreringshjemler={registreringshjemler}
    />
  );
};

interface Props {
  ytelser?: IYtelse[];
  lovkildeToRegistreringshjemler?: IKodeverkValue<string>[];
  sakstyperToUtfall?: SakstypeToUtfall[];
  klageenheter?: IKodeverkSimpleValue<string>[];
  utfall?: IKodeverkSimpleValue<Utfall>[];
  registreringshjemler?: RegistreringshjemlerMap;
}

const RenderFilters = ({
  ytelser = [],
  lovkildeToRegistreringshjemler = [],
  sakstyperToUtfall = [],
  klageenheter = [],
  utfall = [],
  registreringshjemler = {},
}: Props) => (
  <FilterWrapper>
    <HStack justify="space-between">
      <Reset />
      <ResetCacheButton />
    </HStack>
    <DateRange />
    <Klageenheter klageenheter={klageenheter} />
    <UtfallFilter utfall={utfall} />
    <YtelserAndInnsendingsAndRegistreringshjemler
      ytelser={ytelser}
      lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler}
    />
    <Tilbakekreving help={<HelpForFerdigstilte />} />
    <ActiveFilters
      ytelser={ytelser}
      klageenheter={klageenheter}
      sakstyper={sakstyperToUtfall}
      utfall={utfall}
      registreringshjemler={registreringshjemler}
    />
  </FilterWrapper>
);
