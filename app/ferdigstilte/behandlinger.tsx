'use client';

import { Card } from '@/components/cards';
import { Alder } from '@/components/charts/alder';
import { AlderPerYtelse } from '@/components/charts/alder-per-ytelse';
import { LoadingError } from '@/components/charts/common/loading-error';
import { SkeletonFerdigstilte } from '@/components/charts/common/skeleton-chart';
import { useFerdigstilte } from '@/components/charts/common/use-data';
import { useRelevantYtelser } from '@/components/charts/common/use-relevant-ytelser';
import { FristIKabal } from '@/components/charts/frist-i-kabal';
import { FristPerYtelse } from '@/components/charts/frist-per-ytelse';
import { SakerPerSakstype } from '@/components/charts/saker-per-sakstype';
import { SakerPerYtelseOgSakstype } from '@/components/charts/saker-per-ytelse-og-sakstype';
import { TildelteSakerPerKlageenhet } from '@/components/charts/tildelte-saker-per-klageenhet';
import { TildelteSakerPerYtelseOgKlageenhet } from '@/components/charts/tildelte-saker-per-ytelse-og-klageenhet';
import { VarsletFrist } from '@/components/charts/varslet-frist';
import { VarsletFristPerYtelse } from '@/components/charts/varslet-frist-per-ytelse';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { useClientFetch } from '@/lib/client/use-client-fetch';
import type {
  AnkeFerdigstilt,
  IKodeverkSimpleValue,
  IYtelse,
  KapteinApiResponse,
  KlageFerdigstilt,
  Sakstype,
} from '@/lib/types';

type KlageResponse = KapteinApiResponse<KlageFerdigstilt>;
type AnkeResponse = KapteinApiResponse<AnkeFerdigstilt>;

interface KodeverkProps {
  ytelser: IYtelse[];
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
  klageenheter: IKodeverkSimpleValue[];
}

export const Behandlinger = (kodeverk: KodeverkProps) => {
  const {
    data: klager,
    isLoading: isLoadingKlager,
    error: errorKlager,
  } = useClientFetch<KlageResponse>('/api/klager/ferdigstilte');
  const {
    data: anker,
    isLoading: isLoadingAnker,
    error: errorAnker,
  } = useClientFetch<AnkeResponse>('/api/anker/ferdigstilte');

  if (isLoadingKlager || isLoadingAnker) {
    return <SkeletonFerdigstilte />;
  }

  if (errorKlager !== null) {
    return <LoadingError>Feil ved lasting av data: {errorKlager}</LoadingError>;
  }

  if (errorAnker !== null) {
    return <LoadingError>Feil ved lasting av data: {errorAnker}</LoadingError>;
  }

  return <BehandlingerData {...kodeverk} klager={klager.behandlinger} anker={anker.behandlinger} />;
};

interface DataProps extends KodeverkProps {
  klager: KlageFerdigstilt[];
  anker: AnkeFerdigstilt[];
}

const BehandlingerData = ({ klager, anker, sakstyper, ytelser, klageenheter }: DataProps) => {
  const filteredKlager = useFerdigstilte(klager);
  const filteredAnker = useFerdigstilte(anker);
  const behandlinger = [...filteredKlager, ...filteredAnker];
  const relevantYtelser = useRelevantYtelser(behandlinger, ytelser);

  return (
    <ChartsWrapper>
      <Card span={4}>
        <SakerPerYtelseOgSakstype behandlinger={behandlinger} sakstyper={sakstyper} relevantYtelser={relevantYtelser} />
      </Card>

      <Card>
        <SakerPerSakstype behandlinger={behandlinger} sakstyper={sakstyper} />
      </Card>

      <Card>
        <TildelteSakerPerKlageenhet
          title="Saker per klageenhet"
          behandlinger={behandlinger}
          klageenheter={klageenheter}
        />
      </Card>

      <Card span={4}>
        <TildelteSakerPerYtelseOgKlageenhet
          title="Saker per ytelse og klageenhet"
          behandlinger={behandlinger}
          klageenheter={klageenheter}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card>
        <VarsletFrist behandlinger={behandlinger} />
      </Card>

      <Card>
        <FristIKabal behandlinger={behandlinger} />
      </Card>

      <Card span={4}>
        <VarsletFristPerYtelse behandlinger={behandlinger} relevantYtelser={relevantYtelser} />
      </Card>

      <Card span={4}>
        <FristPerYtelse behandlinger={behandlinger} relevantYtelser={relevantYtelser} />
      </Card>

      <Card span={2}>
        <Alder behandlinger={behandlinger} />
      </Card>

      <Card span={4}>
        <AlderPerYtelse behandlinger={behandlinger} relevantYtelser={relevantYtelser} />
      </Card>
    </ChartsWrapper>
  );
};
