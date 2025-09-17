'use client';

import { BodyLong, List } from '@navikt/ds-react';
import { useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { parseAsLedigeFilter } from '@/app/custom-query-parsers';
import { TildelingFilter } from '@/app/query-types';
import { Alder } from '@/components/behandlinger/alder';
import { AlderPerYtelse } from '@/components/behandlinger/alder-per-ytelse';
import { FristIKabal } from '@/components/behandlinger/frist-i-kabal';
import { FristPerYtelse } from '@/components/behandlinger/frist-per-ytelse';
import { LedigeVsTildelte } from '@/components/behandlinger/ledige-vs-tildelte';
import { LoadingError } from '@/components/behandlinger/loading-error';
import { PåVentPerYtelse } from '@/components/behandlinger/på-vent-per-ytelse';
import { SakerPerSakstype } from '@/components/behandlinger/saker-per-sakstype';
import { SakerPerYtelseOgSakstype } from '@/components/behandlinger/saker-per-ytelse-og-sakstype';
import { SkeletonChartAktive } from '@/components/behandlinger/skeleton-chart';
import { TildelteSakerPerKlageenhet } from '@/components/behandlinger/tildelte-saker-per-klageenhet';
import { TildelteSakerPerYtelseOgKlageenhet } from '@/components/behandlinger/tildelte-saker-per-ytelse-og-klageenhet';
import { TildelteSakerPåVentIkkePåVent } from '@/components/behandlinger/tildelte-saker-på-vent-ikke-på-vent';
import { useAktive } from '@/components/behandlinger/use-data';
import { useRelevantYtelser } from '@/components/behandlinger/use-relevant-ytelser';
import { VarsletFrist } from '@/components/behandlinger/varslet-frist';
import { VarsletFristPerYtelse } from '@/components/behandlinger/varslet-frist-per-ytelse';
import { Card } from '@/components/cards';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { useClientFetch } from '@/lib/client/use-client-fetch';
import type {
  IKodeverkSimpleValue,
  IKodeverkValue,
  IYtelse,
  KapteinApiResponse,
  LedigBehandling,
  Sakstype,
  TildeltBehandling,
} from '@/lib/server/types';
import { QueryParam } from '@/lib/types/query-param';

type LedigeResponse = KapteinApiResponse<LedigBehandling>;
type TildelteResponse = KapteinApiResponse<TildeltBehandling>;

interface Props {
  ledige: LedigeResponse;
  tildelte: TildelteResponse;
}

interface KodeverkProps {
  ytelser: IYtelse[];
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
  klageenheter: IKodeverkSimpleValue[];
  påVentReasons: IKodeverkValue[];
}

export const Behandlinger = (kodeverk: KodeverkProps) => {
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

  if (ledigeLoading || tildelteLoading) {
    return <SkeletonChartAktive />;
  }

  if (ledigeError !== null || tildelteError !== null) {
    return (
      <LoadingError>
        <BodyLong>Feil ved lasting av data:</BodyLong>
        <List>
          {ledigeError === null ? null : <List.Item>{ledigeError}</List.Item>}
          {tildelteError === null ? null : <List.Item>{tildelteError}</List.Item>}
        </List>
      </LoadingError>
    );
  }

  return <BehandlingerData ledige={ledige} tildelte={tildelte} {...kodeverk} />;
};

const BehandlingerData = ({
  ledige,
  tildelte,
  sakstyper,
  ytelser,
  klageenheter,
  påVentReasons,
}: Props & KodeverkProps) => {
  const [tildelingFilter] = useQueryState(QueryParam.TILDELING, parseAsLedigeFilter);
  const showsLedige = tildelingFilter === TildelingFilter.LEDIGE;
  const showsAlle = tildelingFilter === TildelingFilter.ALL;

  const behandlinger = useMemo(() => {
    if (tildelingFilter === TildelingFilter.LEDIGE) {
      return ledige.behandlinger;
    }

    if (tildelingFilter === TildelingFilter.TILDELTE) {
      return tildelte.behandlinger;
    }

    return [...ledige.behandlinger, ...tildelte.behandlinger];
  }, [tildelingFilter, ledige, tildelte]);

  const filteredBehandlinger = useAktive(behandlinger);
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

      {showsAlle ? (
        <Card>
          <LedigeVsTildelte behandlinger={filteredBehandlinger} />
        </Card>
      ) : null}

      {showsLedige ? null : (
        <Card>
          <TildelteSakerPåVentIkkePåVent behandlinger={filteredBehandlinger} />
        </Card>
      )}

      <Card span={3}>
        <PåVentPerYtelse
          behandlinger={filteredBehandlinger}
          relevantYtelser={relevantYtelser}
          påVentReasons={påVentReasons}
        />
      </Card>

      {showsLedige ? null : (
        <Card>
          <TildelteSakerPerKlageenhet
            behandlinger={filteredBehandlinger}
            klageenheter={klageenheter}
            title="Tildelte saker per klageenhet"
          />
        </Card>
      )}

      {showsLedige ? null : (
        <Card span={3}>
          <TildelteSakerPerYtelseOgKlageenhet
            title="Tildelte saker per ytelse og klageenhet"
            behandlinger={filteredBehandlinger}
            klageenheter={klageenheter}
            relevantYtelser={relevantYtelser}
          />
        </Card>
      )}

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
