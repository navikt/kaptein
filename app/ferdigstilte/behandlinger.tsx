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
import { InngangUtgang } from '@/components/charts/inngang-utgang';
import { SakerPerSakstype } from '@/components/charts/saker-per-sakstype';
import { SakerPerYtelseOgSakstype } from '@/components/charts/saker-per-ytelse-og-sakstype';
import { TildelteSakerPerKlageenhet } from '@/components/charts/tildelte-saker-per-klageenhet';
import { TildelteSakerPerYtelseOgKlageenhet } from '@/components/charts/tildelte-saker-per-ytelse-og-klageenhet';
import { VarsletFrist } from '@/components/charts/varslet-frist';
import { VarsletFristPerYtelse } from '@/components/charts/varslet-frist-per-ytelse';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { useClientFetch } from '@/lib/client/use-client-fetch';
import type {
  FerdigstiltBehandling,
  IKodeverkSimpleValue,
  IYtelse,
  KapteinApiResponse,
  Sakstype,
} from '@/lib/server/types';

type Response = KapteinApiResponse<FerdigstiltBehandling>;

interface KodeverkProps {
  ytelser: IYtelse[];
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
  klageenheter: IKodeverkSimpleValue[];
}

export const Behandlinger = (kodeverk: KodeverkProps) => {
  const { data, isLoading, error } = useClientFetch<Response>('/api/behandlinger/ferdigstilte');

  if (isLoading) {
    return <SkeletonFerdigstilte />;
  }

  if (error !== null) {
    return <LoadingError>Feil ved lasting av data: {error}</LoadingError>;
  }

  return <BehandlingerData {...data} {...kodeverk} />;
};

const BehandlingerData = ({ behandlinger, sakstyper, ytelser, klageenheter }: Response & KodeverkProps) => {
  const filteredBehandlinger = useFerdigstilte(behandlinger);
  const relevantYtelser = useRelevantYtelser(filteredBehandlinger, ytelser);

  return (
    <ChartsWrapper>
      <Card span={4}>
        <SakerPerYtelseOgSakstype
          behandlinger={filteredBehandlinger}
          sakstyper={sakstyper}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card>
        <SakerPerSakstype behandlinger={filteredBehandlinger} sakstyper={sakstyper} />
      </Card>

      <Card>
        <TildelteSakerPerKlageenhet
          title="Saker per klageenhet"
          behandlinger={filteredBehandlinger}
          klageenheter={klageenheter}
        />
      </Card>

      <Card span={4}>
        <TildelteSakerPerYtelseOgKlageenhet
          title="Saker per ytelse og klageenhet"
          behandlinger={filteredBehandlinger}
          klageenheter={klageenheter}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card>
        <VarsletFrist behandlinger={filteredBehandlinger} />
      </Card>

      <Card>
        <FristIKabal behandlinger={filteredBehandlinger} />
      </Card>

      <Card span={4}>
        <VarsletFristPerYtelse behandlinger={filteredBehandlinger} relevantYtelser={relevantYtelser} />
      </Card>

      <Card span={4}>
        <FristPerYtelse behandlinger={filteredBehandlinger} relevantYtelser={relevantYtelser} />
      </Card>

      <Card span={2}>
        <Alder behandlinger={filteredBehandlinger} />
      </Card>

      <Card span={4}>
        <AlderPerYtelse behandlinger={filteredBehandlinger} relevantYtelser={relevantYtelser} />
      </Card>

      <Card fullWidth>
        <InngangUtgang behandlinger={filteredBehandlinger} />
      </Card>
    </ChartsWrapper>
  );
};
