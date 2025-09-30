'use client';

import { HStack, VStack } from '@navikt/ds-react';
import { Card } from '@/components/cards';
import { AlderHistogram } from '@/components/charts/alder-histogram';
import { useAnkerITR } from '@/components/charts/common/data/use-anke-i-tr';
import { LoadingError } from '@/components/charts/common/loading-error';
import { SkeletonFerdigstilte } from '@/components/charts/common/skeleton-chart';
import { useRelevantYtelser } from '@/components/charts/common/use-relevant-ytelser';
import { TildelteSakerPerKlageenhet } from '@/components/charts/tildelte-saker-per-klageenhet';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { KeyStat } from '@/components/key-stat';
import { useClientFetch } from '@/lib/client/use-client-fetch';
import type {
  AnkeITRBehandling,
  IKodeverkSimpleValue,
  IYtelse,
  KapteinApiResponse,
  Sakstype,
} from '@/lib/server/types';

type Response = KapteinApiResponse<AnkeITRBehandling>;

interface KodeverkProps {
  ytelser: IYtelse[];
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
  klageenheter: IKodeverkSimpleValue[];
}

export const Behandlinger = (kodeverk: KodeverkProps) => {
  const { data, isLoading, error } = useClientFetch<Response>('/api/behandlinger/ferdigstilte'); // TODO: Endre til anker i TR endepunkt.

  if (isLoading) {
    return <SkeletonFerdigstilte />;
  }

  if (error !== null) {
    return <LoadingError>Feil ved lasting av data: {error}</LoadingError>;
  }

  return <BehandlingerData {...data} {...kodeverk} />;
};

const BehandlingerData = ({ behandlinger, sakstyper, ytelser, klageenheter }: Response & KodeverkProps) => {
  const filteredBehandlinger = useAnkerITR(behandlinger);
  const relevantYtelser = useRelevantYtelser(filteredBehandlinger, ytelser);

  return (
    <VStack flexGrow="1">
      <HStack padding="6">
        <KeyStat description="Anker i TR">{filteredBehandlinger.length}</KeyStat>
      </HStack>

      <ChartsWrapper>
        <Card>
          <TildelteSakerPerKlageenhet
            title="Anker i TR per klageenhet"
            behandlinger={filteredBehandlinger}
            klageenheter={klageenheter}
          />
        </Card>

        <Card>
          <AlderHistogram behandlinger={filteredBehandlinger} />
        </Card>
      </ChartsWrapper>
    </VStack>
  );
};
