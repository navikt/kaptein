'use client';

import { Loader, VStack } from '@navikt/ds-react';
import { Alder } from '@/components/behandlinger/alder';
import { AlderPerYtelse } from '@/components/behandlinger/alder-per-ytelse';
import { FristIKabal } from '@/components/behandlinger/frist-i-kabal';
import { FristPerYtelse } from '@/components/behandlinger/frist-per-ytelse';
import { LoadingError } from '@/components/behandlinger/loading-error';
import { SakerPerSakstype } from '@/components/behandlinger/saker-per-sakstype';
import { SakerPerYtelseOgSakstype } from '@/components/behandlinger/saker-per-ytelse-og-sakstype';
import { TildelteSakerPerKlageenhet } from '@/components/behandlinger/tildelte-saker-per-klageenhet';
import { TildelteSakerPerYtelseOgKlageenhet } from '@/components/behandlinger/tildelte-saker-per-ytelse-og-klageenhet';
import { useFerdigstilte } from '@/components/behandlinger/use-data';
import { useRelevantYtelser } from '@/components/behandlinger/use-relevant-ytelser';
import { VarsletFrist } from '@/components/behandlinger/varslet-frist';
import { VarsletFristPerYtelse } from '@/components/behandlinger/varslet-frist-per-ytelse';
import { Card } from '@/components/cards';
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
    return (
      <VStack align="center" justify="center" className="w-full">
        <Loader size="3xlarge" />
      </VStack>
    );
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
      <Card span={3}>
        <SakerPerYtelseOgSakstype
          behandlinger={filteredBehandlinger}
          sakstyper={sakstyper}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card>
        <SakerPerSakstype behandlinger={filteredBehandlinger} sakstyper={sakstyper} />
      </Card>

      <Card span={3}>
        <TildelteSakerPerKlageenhet
          title="Saker per klageenhet"
          behandlinger={filteredBehandlinger}
          klageenheter={klageenheter}
        />
      </Card>

      <Card span={3}>
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

      <Card span={3}>
        <VarsletFristPerYtelse behandlinger={filteredBehandlinger} relevantYtelser={relevantYtelser} />
      </Card>

      <Card span={3}>
        <FristPerYtelse behandlinger={filteredBehandlinger} relevantYtelser={relevantYtelser} />
      </Card>

      <Card span={3}>
        <Alder behandlinger={filteredBehandlinger} />
      </Card>

      <Card span={4}>
        <AlderPerYtelse behandlinger={filteredBehandlinger} relevantYtelser={relevantYtelser} />
      </Card>
    </ChartsWrapper>
  );
};
