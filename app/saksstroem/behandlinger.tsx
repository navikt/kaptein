'use client';

import { BodyLong, List } from '@navikt/ds-react';
import { Card } from '@/components/cards';
import { LoadingError } from '@/components/charts/common/loading-error';
import { SkeletonFerdigstilte } from '@/components/charts/common/skeleton-chart';
import { useTest } from '@/components/charts/common/use-data';
import { InngangUtgang } from '@/components/charts/inngang-utgang';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { useClientFetch } from '@/lib/client/use-client-fetch';
import type { Behandling, FerdigstilteResponse, LedigeResponse, TildelteResponse } from '@/lib/server/types';

export const Behandlinger = () => {
  const {
    data: ledige,
    error: ledigeError,
    isLoading: ledigeLoading,
  } = useClientFetch<LedigeResponse>('/api/behandlinger/ledige');
  const {
    data: tildelte,
    error: tildelteError,
    isLoading: tildelteLoading,
  } = useClientFetch<TildelteResponse>('/api/behandlinger/tildelte');
  const {
    data: ferdigstilte,
    isLoading: ferdigstilteLoading,
    error: ferdigstilteError,
  } = useClientFetch<FerdigstilteResponse>('/api/behandlinger/ferdigstilte');

  if (ledigeLoading || tildelteLoading || ferdigstilteLoading) {
    return <SkeletonFerdigstilte />;
  }

  if (ledigeError !== null || tildelteError !== null || ferdigstilteError !== null) {
    return (
      <LoadingError>
        <BodyLong>Feil ved lasting av data:</BodyLong>
        <List>
          {ledigeError === null ? null : <List.Item>{ledigeError}</List.Item>}
          {tildelteError === null ? null : <List.Item>{tildelteError}</List.Item>}
          {ferdigstilteError === null ? null : <List.Item>{ferdigstilteError}</List.Item>}
        </List>
      </LoadingError>
    );
  }

  return (
    <BehandlingerData behandlinger={[...ledige.behandlinger, ...tildelte.behandlinger, ...ferdigstilte.behandlinger]} />
  );
};

const BehandlingerData = ({ behandlinger }: { behandlinger: Behandling[] }) => {
  const filtered = useTest(behandlinger);

  return (
    <ChartsWrapper>
      <Card fullWidth>
        <InngangUtgang behandlinger={filtered} />
      </Card>
    </ChartsWrapper>
  );
};
