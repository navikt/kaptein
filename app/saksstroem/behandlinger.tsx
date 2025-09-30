'use client';

import { BodyLong, List } from '@navikt/ds-react';
import { useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { parseAsLedigeFilter } from '@/app/custom-query-parsers';
import { TildelingFilter } from '@/app/query-types';
import { Card } from '@/components/cards';
import { LoadingError } from '@/components/charts/common/loading-error';
import { SkeletonFerdigstilte } from '@/components/charts/common/skeleton-chart';
import { useSaksstrøm } from '@/components/charts/common/use-data';
import { InngangUtgang } from '@/components/charts/inngang-utgang';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { useClientFetch } from '@/lib/client/use-client-fetch';
import type {
  FerdigstiltBehandling,
  FerdigstilteResponse,
  LedigBehandling,
  LedigeResponse,
  TildeltBehandling,
  TildelteResponse,
} from '@/lib/server/types';
import { QueryParam } from '@/lib/types/query-param';

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
    <BehandlingerData
      ledige={ledige.behandlinger}
      tildelte={tildelte.behandlinger}
      ferdigstilte={ferdigstilte.behandlinger}
    />
  );
};

const BehandlingerData = ({
  ledige,
  tildelte,
  ferdigstilte,
}: {
  ledige: LedigBehandling[];
  tildelte: TildeltBehandling[];
  ferdigstilte: FerdigstiltBehandling[];
}) => {
  const [tildelingFilter] = useQueryState(QueryParam.TILDELING, parseAsLedigeFilter);

  const behandlinger = useMemo(() => {
    if (tildelingFilter === TildelingFilter.LEDIGE) {
      return [...ledige, ...ferdigstilte];
    }

    if (tildelingFilter === TildelingFilter.TILDELTE) {
      return [...tildelte, ...ferdigstilte];
    }

    return [...ledige, ...tildelte, ...ferdigstilte];
  }, [tildelingFilter, ledige, tildelte, ferdigstilte]);

  const filtered = useSaksstrøm(behandlinger);

  return (
    <ChartsWrapper>
      <Card fullWidth>
        <InngangUtgang behandlinger={filtered} />
      </Card>
    </ChartsWrapper>
  );
};
