'use client';

import { BodyLong, BodyShort } from '@navikt/ds-react';
import { useMemo } from 'react';
import { Skeleton } from '@/app/aktive-saker-i-tr/skeleton';
import { TildelingFilter } from '@/app/query-types';
import { Card } from '@/components/cards';
import { LoadingError } from '@/components/charts/common/loading-error';
import { useSakITRFilter } from '@/components/charts/common/use-data';
import { useRelevantYtelser } from '@/components/charts/common/use-relevant-ytelser';
import { DaysThresholdPieChart } from '@/components/charts/days-threshold';
import { DaysThresholdPerYtelse } from '@/components/charts/days-threshold-per-ytelse';
import { Tidsfordeling } from '@/components/charts/tidsfordeling';
import { TildelteSakerPerKlageenhetOgYtelse } from '@/components/charts/tildelte-saker-per-klageenhet-og-ytelse';
import { TildelteSakerPerYtelseOgKlageenhet } from '@/components/charts/tildelte-saker-per-ytelse-og-klageenhet';
import { TildelteSakerPåVentIkkePåVent } from '@/components/charts/tildelte-saker-på-vent-ikke-på-vent';
import { ÅrsakerForBehandlingerPåVentGruppertEtterYtelse } from '@/components/charts/årsaker-for-behandlinger-på-vent-gruppert-etter-ytelse';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { TypeTag } from '@/components/type-tag/type-tag';
import { useClientKapteinApiFetch } from '@/lib/client/use-client-fetch';
import { useRelevantPåVentReasons } from '@/lib/hooks/use-relevant-på-vent-reasons';
import { useTildelingFilter, useTrSakstyperFilter } from '@/lib/query-state/query-state';
import {
  type AnkeITRLedig,
  type AnkeITRTildelt,
  type AnkerITRLedigeResponse,
  type AnkerITRTildelteResponse,
  type BegjæringOmGjenopptakITRLedig,
  type BegjæringOmGjenopptakITRLedigeResponse,
  type BegjæringOmGjenopptakITRTildelt,
  type BegjæringOmGjenopptakITRTildelteResponse,
  type IKodeverkSimpleValue,
  type IYtelse,
  Sakstype,
  type SakstypeToPåVentReasons,
  TR_SAKSTYPER,
} from '@/lib/types';

interface KodeverkProps {
  ytelser: IYtelse[];
  klageenheter: IKodeverkSimpleValue[];
  sakstyperToPåVentReasons: SakstypeToPåVentReasons[];
}

export const Behandlinger = (kodeverk: KodeverkProps) => {
  const {
    data: ledigeAnker,
    isLoading: isLoadingLedigeAnker,
    error: errorLedigeAnker,
  } = useClientKapteinApiFetch<AnkerITRLedigeResponse>('/anker-i-tr/ledige');
  const {
    data: tildelteAnker,
    isLoading: isLoadingTildelteAnker,
    error: errorTildelteAnker,
  } = useClientKapteinApiFetch<AnkerITRTildelteResponse>('/anker-i-tr/tildelte');
  const {
    data: ledigeGb,
    isLoading: isLoadingLedigeGb,
    error: errorLedigeGb,
  } = useClientKapteinApiFetch<BegjæringOmGjenopptakITRLedigeResponse>('/begjaeringer-om-gjenopptak-i-tr/ledige');
  const {
    data: tildelteGb,
    isLoading: isLoadingTildelteGb,
    error: errorTildelteGb,
  } = useClientKapteinApiFetch<BegjæringOmGjenopptakITRTildelteResponse>('/begjaeringer-om-gjenopptak-i-tr/tildelte');

  if (isLoadingLedigeAnker || isLoadingTildelteAnker || isLoadingLedigeGb || isLoadingTildelteGb) {
    return <Skeleton />;
  }

  if (errorLedigeAnker !== null) {
    return <LoadingError>Feil ved lasting av data: {errorLedigeAnker}</LoadingError>;
  }

  if (errorTildelteAnker !== null) {
    return <LoadingError>Feil ved lasting av data: {errorTildelteAnker}</LoadingError>;
  }

  if (errorLedigeGb !== null) {
    return <LoadingError>Feil ved lasting av data: {errorLedigeGb}</LoadingError>;
  }

  if (errorTildelteGb !== null) {
    return <LoadingError>Feil ved lasting av data: {errorTildelteGb}</LoadingError>;
  }

  return (
    <BehandlingerData
      {...kodeverk}
      ledigeAnker={ledigeAnker.behandlinger}
      tildelteAnker={tildelteAnker.behandlinger}
      ledigeGb={ledigeGb.behandlinger}
      tildelteGb={tildelteGb.behandlinger}
    />
  );
};

interface DataProps extends KodeverkProps {
  ledigeAnker: AnkeITRLedig[];
  tildelteAnker: AnkeITRTildelt[];
  ledigeGb: BegjæringOmGjenopptakITRLedig[];
  tildelteGb: BegjæringOmGjenopptakITRTildelt[];
}

const BehandlingerData = ({
  ledigeAnker,
  tildelteAnker,
  ledigeGb,
  tildelteGb,
  ytelser,
  klageenheter,
  sakstyperToPåVentReasons,
}: DataProps) => {
  const ledigeFiltered = useSakITRFilter([...ledigeAnker, ...ledigeGb]);
  const tildelteFiltered = useSakITRFilter([...tildelteAnker, ...tildelteGb]);

  const [selectedSakstyper] = useTrSakstyperFilter();

  const påVentReasons = useRelevantPåVentReasons(
    selectedSakstyper.length === 0 ? TR_SAKSTYPER : selectedSakstyper,
    sakstyperToPåVentReasons,
  );

  const uferdige = useMemo(
    () => [...ledigeFiltered.map((b) => ({ ...b, tildeltEnhet: b.tildeltEnhet ?? '4293' })), ...tildelteFiltered],
    [ledigeFiltered, tildelteFiltered],
  );
  const relevantYtelser = useRelevantYtelser([...ledigeFiltered, ...tildelteFiltered], ytelser);
  const [tildelingFilter] = useTildelingFilter();

  const showsLedige = tildelingFilter === TildelingFilter.LEDIGE;

  return (
    <ChartsWrapper>
      {showsLedige ? null : (
        <Card>
          <TildelteSakerPåVentIkkePåVent behandlinger={tildelteFiltered} påVentReasons={påVentReasons} />
        </Card>
      )}

      {showsLedige ? null : (
        <Card span={5}>
          <ÅrsakerForBehandlingerPåVentGruppertEtterYtelse
            title="Årsaker for saker på vent gruppert etter ytelse"
            behandlinger={tildelteFiltered}
            relevantYtelser={relevantYtelser}
            påVentReasons={påVentReasons}
          />
        </Card>
      )}

      <Card span={3}>
        <TildelteSakerPerKlageenhetOgYtelse
          title="Aktive saker i TR per klageenhet og ytelse"
          description={`Viser data for ${uferdige.length} aktive saker i TR`}
          helpText={ANKE_I_TR_HELP_TEXT}
          behandlinger={uferdige}
          klageenheter={klageenheter}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card span={5}>
        <TildelteSakerPerYtelseOgKlageenhet
          title="Aktive saker i TR per ytelse og klageenhet"
          description={`Viser data for ${uferdige.length} aktive saker i TR`}
          helpText={ANKE_I_TR_HELP_TEXT}
          behandlinger={uferdige}
          klageenheter={klageenheter}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card span={4}>
        <Tidsfordeling
          title="Aldersfordeling"
          helpText={ALDER_HELP_TEXT}
          caseType="Aktive"
          behandlinger={uferdige}
          getDays={(b) => b.ageKA}
        />
      </Card>

      <Card span={2}>
        <DaysThresholdPieChart
          title="Alder"
          helpText={ALDER_HELP_TEXT}
          description={`Viser data for ${uferdige.length} aktive saker`}
          behandlinger={uferdige}
        />
      </Card>

      <Card span={5}>
        <DaysThresholdPerYtelse
          title="Alder per ytelse"
          helpText={ALDER_HELP_TEXT}
          description={`Viser data for ${uferdige.length} aktive saker`}
          behandlinger={uferdige}
          relevantYtelser={relevantYtelser}
        />
      </Card>
    </ChartsWrapper>
  );
};

const ANKE_I_TR_HELP_TEXT = (
  <>
    <BodyLong spacing>
      Hver gang en <TypeTag type={Sakstype.ANKE} /> i Kabal ferdigstilles med et utfall som innebærer at saken går
      videre til Trygderetten, opprettes en <TypeTag type={Sakstype.ANKE_I_TRYGDERETTEN} />
      -oppgave. Aktive anker i TR-fanen i Kaptein viser hvor mange slike aktive{' '}
      <TypeTag type={Sakstype.ANKE_I_TRYGDERETTEN} />
      -saker som ligger i Kabal til enhver tid.
    </BodyLong>
    <BodyLong>
      Aktiv <TypeTag type={Sakstype.ANKE_I_TRYGDERETTEN} />
      -oppgave knyttes til samme klageenhet som den ferdigstilte <TypeTag type={Sakstype.ANKE} />
      -oppgaven i Kabal som førte til opprettelsen av
      <TypeTag type={Sakstype.ANKE_I_TRYGDERETTEN} />
      -oppgaven.
    </BodyLong>
  </>
);

const ALDER_HELP_TEXT = (
  <BodyShort>
    Alder regnes fra dato <TypeTag type={Sakstype.ANKE} />
    -oppgaven ble ferdigstilt / <TypeTag type={Sakstype.ANKE_I_TRYGDERETTEN} />
    -oppgaven ble opprettet til dagens dato.
  </BodyShort>
);
