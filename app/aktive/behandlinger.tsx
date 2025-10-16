'use client';

import { BodyLong, List } from '@navikt/ds-react';
import { useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { parseAsLedigeFilter } from '@/app/custom-query-parsers';
import { TildelingFilter } from '@/app/query-types';
import { Card } from '@/components/cards';
import { LoadingError } from '@/components/charts/common/loading-error';
import { SkeletonAktive } from '@/components/charts/common/skeleton-chart';
import { useBaseFiltered } from '@/components/charts/common/use-data';
import { useRelevantYtelser } from '@/components/charts/common/use-relevant-ytelser';
import { DaysThresholdPieChart } from '@/components/charts/days-threshold';
import { DaysThresholdPerYtelse } from '@/components/charts/days-threshold-per-ytelse';
import { FristIKabal } from '@/components/charts/frist-i-kabal';
import { FristPerYtelse } from '@/components/charts/frist-per-ytelse';
import { LedigeVsTildelte } from '@/components/charts/ledige-vs-tildelte';
import { SakerPerSakstype } from '@/components/charts/saker-per-sakstype';
import { SakerPerYtelseOgSakstype } from '@/components/charts/saker-per-ytelse-og-sakstype';
import { Tidsfordeling } from '@/components/charts/tidsfordeling';
import { TildelteSakerPerKlageenhet } from '@/components/charts/tildelte-saker-per-klageenhet';
import { TildelteSakerPerYtelseOgKlageenhet } from '@/components/charts/tildelte-saker-per-ytelse-og-klageenhet';
import { TildelteSakerPåVentIkkePåVent } from '@/components/charts/tildelte-saker-på-vent-ikke-på-vent';
import { VarsletFrist } from '@/components/charts/varslet-frist';
import { VarsletFristPerYtelse } from '@/components/charts/varslet-frist-per-ytelse';
import { ÅrsakerForBehandlingerPåVentGruppertEtterYtelse } from '@/components/charts/årsaker-for-behandlinger-på-vent-gruppert-etter-ytelse';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { useClientKapteinApiFetch } from '@/lib/client/use-client-fetch';
import type {
  AnkeLedig,
  AnkerLedigeResponse,
  AnkerTildelteResponse,
  AnkeTildelt,
  BetongLedig,
  BetongLedigeResponse,
  BetongTildelt,
  BetongTildelteResponse,
  IKodeverkSimpleValue,
  IKodeverkValue,
  IYtelse,
  KlageLedig,
  KlagerLedigeResponse,
  KlagerTildelteResponse,
  KlageTildelt,
  OmgjøringskravLedig,
  OmgjøringskravLedigeResponse,
  OmgjøringskravTildelt,
  OmgjøringskravTildelteResponse,
  PåVentReason,
  Sakstype,
} from '@/lib/types';
import { QueryParam } from '@/lib/types/query-param';

interface KodeverkProps {
  ytelser: IYtelse[];
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
  klageenheter: IKodeverkSimpleValue[];
  påVentReasons: IKodeverkValue<PåVentReason>[];
}

export const Behandlinger = (kodeverk: KodeverkProps) => {
  const {
    data: klagerLedige,
    error: klagerLedigeError,
    isLoading: klagerLedigeLoading,
  } = useClientKapteinApiFetch<KlagerLedigeResponse>('/klager/ledige');
  const {
    data: klagerTildelte,
    error: klagerTildelteError,
    isLoading: klagerTildelteLoading,
  } = useClientKapteinApiFetch<KlagerTildelteResponse>('/klager/tildelte');
  const {
    data: ankerLedige,
    error: ankerLedigeError,
    isLoading: ankerLedigeLoading,
  } = useClientKapteinApiFetch<AnkerLedigeResponse>('/anker/ledige');
  const {
    data: ankerTildelte,
    error: ankerTildelteError,
    isLoading: ankerTildelteLoading,
  } = useClientKapteinApiFetch<AnkerTildelteResponse>('/anker/tildelte');
  const {
    data: betongLedige,
    error: betongLedigeError,
    isLoading: betongLedigeLoading,
  } = useClientKapteinApiFetch<BetongLedigeResponse>('/behandlinger-etter-tr-opphevet/ledige');
  const {
    data: betongTildelte,
    error: betongTildelteError,
    isLoading: betongTildelteLoading,
  } = useClientKapteinApiFetch<BetongTildelteResponse>('/behandlinger-etter-tr-opphevet/tildelte');
  const {
    data: omgjøringskravLedige,
    error: omgjøringskravLedigeError,
    isLoading: omgjøringskravLedigeLoading,
  } = useClientKapteinApiFetch<OmgjøringskravLedigeResponse>('/omgjoeringskrav/ledige');
  const {
    data: omgjøringskravTildelte,
    error: omgjøringskravTildelteError,
    isLoading: omgjøringskravTildelteLoading,
  } = useClientKapteinApiFetch<OmgjøringskravTildelteResponse>('/omgjoeringskrav/tildelte');

  if (
    klagerLedigeLoading ||
    klagerTildelteLoading ||
    ankerLedigeLoading ||
    ankerTildelteLoading ||
    betongLedigeLoading ||
    betongTildelteLoading ||
    omgjøringskravLedigeLoading ||
    omgjøringskravTildelteLoading
  ) {
    return <SkeletonAktive />;
  }

  if (
    klagerLedigeError !== null ||
    klagerTildelteError !== null ||
    ankerLedigeError !== null ||
    ankerTildelteError !== null ||
    betongLedigeError !== null ||
    betongTildelteError !== null ||
    omgjøringskravLedigeError !== null ||
    omgjøringskravTildelteError !== null
  ) {
    return (
      <LoadingError>
        <BodyLong>Feil ved lasting av data:</BodyLong>
        <List>
          {klagerLedigeError === null ? null : <List.Item>{klagerLedigeError}</List.Item>}
          {klagerTildelteError === null ? null : <List.Item>{klagerTildelteError}</List.Item>}
          {ankerLedigeError === null ? null : <List.Item>{ankerLedigeError}</List.Item>}
          {ankerTildelteError === null ? null : <List.Item>{ankerTildelteError}</List.Item>}
          {betongLedigeError === null ? null : <List.Item>{betongLedigeError}</List.Item>}
          {betongTildelteError === null ? null : <List.Item>{betongTildelteError}</List.Item>}
          {omgjøringskravLedigeError === null ? null : <List.Item>{omgjøringskravLedigeError}</List.Item>}
          {omgjøringskravTildelteError === null ? null : <List.Item>{omgjøringskravTildelteError}</List.Item>}
        </List>
      </LoadingError>
    );
  }

  return (
    <BehandlingerData
      klagerLedige={klagerLedige.behandlinger}
      klagerTildelte={klagerTildelte.behandlinger}
      ankerLedige={ankerLedige.behandlinger}
      ankerTildelte={ankerTildelte.behandlinger}
      betongLedige={betongLedige.behandlinger}
      betongTildelte={betongTildelte.behandlinger}
      omgjøringskravLedige={omgjøringskravLedige.behandlinger}
      omgjøringskravTildelte={omgjøringskravTildelte.behandlinger}
      {...kodeverk}
    />
  );
};

interface Props {
  klagerLedige: KlageLedig[];
  ankerLedige: AnkeLedig[];
  klagerTildelte: KlageTildelt[];
  ankerTildelte: AnkeTildelt[];
  betongLedige: BetongLedig[];
  betongTildelte: BetongTildelt[];
  omgjøringskravLedige: OmgjøringskravLedig[];
  omgjøringskravTildelte: OmgjøringskravTildelt[];
}

const BehandlingerData = ({
  klagerLedige,
  klagerTildelte,
  ankerLedige,
  ankerTildelte,
  betongLedige,
  betongTildelte,
  omgjøringskravLedige,
  omgjøringskravTildelte,
  sakstyper,
  ytelser,
  klageenheter,
  påVentReasons,
}: Props & KodeverkProps) => {
  const [tildelingFilter] = useQueryState(QueryParam.TILDELING, parseAsLedigeFilter);
  const showsLedige = tildelingFilter === TildelingFilter.LEDIGE;
  const showsAlle = tildelingFilter === TildelingFilter.ALL;

  const tildelte = useMemo(
    () => [...klagerTildelte, ...ankerTildelte, ...betongTildelte, ...omgjøringskravTildelte],
    [ankerTildelte, betongTildelte, klagerTildelte, omgjøringskravTildelte],
  );

  const behandlinger = useMemo(() => {
    if (tildelingFilter === TildelingFilter.LEDIGE) {
      return [...klagerLedige, ...ankerLedige, ...betongLedige, ...omgjøringskravLedige];
    }

    if (tildelingFilter === TildelingFilter.TILDELTE) {
      return tildelte;
    }

    return [...klagerLedige, ...ankerLedige, ...betongLedige, ...omgjøringskravLedige, ...tildelte];
  }, [tildelingFilter, klagerLedige, ankerLedige, betongLedige, omgjøringskravLedige, tildelte]);

  const filteredBehandlinger = useBaseFiltered(behandlinger);
  const filteredTildelte = useBaseFiltered(tildelte);
  const relevantYtelser = useRelevantYtelser(filteredBehandlinger, ytelser);

  return (
    <ChartsWrapper>
      <Card span={4}>
        <SakerPerYtelseOgSakstype
          title="Aktive saker per ytelse og sakstype"
          description={`Viser data for ${behandlinger.length} aktive saker`}
          behandlinger={filteredBehandlinger}
          sakstyper={sakstyper}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card>
        <SakerPerSakstype
          title="Aktive saker per sakstype"
          description={`Viser data for ${behandlinger.length} aktive saker`}
          behandlinger={filteredBehandlinger}
          sakstyper={sakstyper}
        />
      </Card>

      {showsAlle ? (
        <Card>
          <LedigeVsTildelte behandlinger={filteredBehandlinger} />
        </Card>
      ) : null}

      {showsLedige ? null : (
        <Card>
          <TildelteSakerPåVentIkkePåVent behandlinger={filteredTildelte} påVentReasons={påVentReasons} />
        </Card>
      )}

      {showsLedige ? null : (
        <Card span={4}>
          <ÅrsakerForBehandlingerPåVentGruppertEtterYtelse
            title="Årsaker for saker på vent gruppert etter ytelse"
            description={`Antall aktive saker på vent: ${filteredTildelte.length}`}
            behandlinger={filteredTildelte}
            relevantYtelser={relevantYtelser}
            påVentReasons={påVentReasons}
          />
        </Card>
      )}

      {showsLedige ? null : (
        <Card>
          <TildelteSakerPerKlageenhet
            title="Tildelte saker per klageenhet"
            description={`Viser data for ${behandlinger.length} tildelte saker`}
            behandlinger={filteredTildelte}
            klageenheter={klageenheter}
          />
        </Card>
      )}

      {showsLedige ? null : (
        <Card span={4}>
          <TildelteSakerPerYtelseOgKlageenhet
            title="Tildelte saker per ytelse og klageenhet"
            description={`Viser data for ${filteredTildelte.length} tildelte saker`}
            behandlinger={filteredTildelte}
            klageenheter={klageenheter}
            relevantYtelser={relevantYtelser}
          />
        </Card>
      )}

      <Card>
        <VarsletFrist
          title="Varslet frist"
          description={`Viser data for ${behandlinger.length} aktive saker`}
          behandlinger={filteredBehandlinger}
        />
      </Card>

      <Card>
        <FristIKabal
          title="Frist i Kabal"
          description={`Viser data for ${filteredBehandlinger.length} aktive saker`}
          behandlinger={filteredBehandlinger}
        />
      </Card>

      <Card span={4}>
        <VarsletFristPerYtelse
          title="Varslet frist per ytelse"
          description={`Viser data for ${filteredBehandlinger.length} aktive saker`}
          behandlinger={filteredBehandlinger}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card span={4}>
        <FristPerYtelse
          title="Frist per ytelse"
          description={`Viser data for ${behandlinger.length} aktive saker`}
          behandlinger={filteredBehandlinger}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card span={2}>
        <DaysThresholdPieChart
          title="Alder"
          description={`Viser data for ${filteredBehandlinger.length} aktive saker`}
          behandlinger={filteredBehandlinger}
        />
      </Card>

      <Card span={4}>
        <DaysThresholdPerYtelse
          title="Alder"
          description={`Viser data for ${filteredBehandlinger.length} aktive saker`}
          behandlinger={filteredBehandlinger}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card fullWidth span={4}>
        <Tidsfordeling title="Aldersfordeling" behandlinger={filteredBehandlinger} getDays={(b) => b.ageKA} />
      </Card>
    </ChartsWrapper>
  );
};
