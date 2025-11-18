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
import { YtelserAndInnsendingsAndRegistreringshjemler } from '@/components/filters/ytelser-and-hjemler/ytelser-and.hjemler';
import {
  getInnsendingshjemlerMap,
  getKlageenheter,
  getLovkildeToRegistreringshjemler,
  getRegistreringshjemlerMap,
  getTrSaksTyperToUtfall,
  getUtfallForSakstype,
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
  const ankeITRUtfall = await getUtfallForSakstype(Sakstype.ANKE_I_TRYGDERETTEN);
  const gbUtfall = await getUtfallForSakstype(Sakstype.BEGJÆRING_OM_GJENOPPTAK_I_TRYGDERETTEN);
  const klageEnheter = await getKlageenheter();
  const registreringshjemler = await getRegistreringshjemlerMap();
  const innsendingshjemlerMap = await getInnsendingshjemlerMap();
  const sakstyperToUtfall = await getTrSaksTyperToUtfall();

  return (
    <RenderFilters
      ytelser={ytelser}
      lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler}
      klageenheter={klageEnheter}
      utfall={[...ankeITRUtfall, ...gbUtfall]}
      registreringshjemler={registreringshjemler}
      innsendingshjemlerMap={innsendingshjemlerMap}
      sakstyperToUtfall={sakstyperToUtfall}
    />
  );
};

interface Props {
  ytelser?: IYtelse[];
  lovkildeToRegistreringshjemler?: IKodeverkValue<string>[];
  klageenheter?: IKodeverkSimpleValue<string>[];
  utfall?: IKodeverkSimpleValue<Utfall>[];
  registreringshjemler?: RegistreringshjemlerMap;
  innsendingshjemlerMap?: Record<string, string>;
  sakstyperToUtfall?: SakstypeToUtfall[];
}

const RenderFilters = ({
  ytelser = [],
  lovkildeToRegistreringshjemler = [],
  klageenheter = [],
  utfall = [],
  registreringshjemler = {},
  innsendingshjemlerMap = {},
  sakstyperToUtfall = [],
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
      <YtelserAndInnsendingsAndRegistreringshjemler
        ytelser={ytelser}
        lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler}
      />
    </VStack>

    <VStack gap="4" flexGrow="2" width="100%">
      <Tilbakekreving help={<HelpForFerdigstilte />} />
      <ActiveFilters
        ytelser={ytelser}
        klageenheter={klageenheter}
        utfall={utfall}
        registreringshjemler={registreringshjemler}
        innsendingshjemler={innsendingshjemlerMap}
        sakstyper={sakstyperToUtfall}
      />
    </VStack>
  </FilterWrapper>
);
