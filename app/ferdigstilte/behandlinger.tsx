'use client';

import { BodyLong, Tag } from '@navikt/ds-react';
import { Skeleton } from '@/app/ferdigstilte/skeleton';
import { Card } from '@/components/cards';
import { LoadingError } from '@/components/charts/common/loading-error';
import {
  useBaseFiltered,
  useFerdigstilteInPeriod,
  useRegistreringshjemlerFiltered,
} from '@/components/charts/common/use-data';
import { useRelevantYtelser } from '@/components/charts/common/use-relevant-ytelser';
import { DaysThresholdPieChart } from '@/components/charts/days-threshold';
import { DaysThresholdPerYtelse } from '@/components/charts/days-threshold-per-ytelse';
import { FerdigstilteOverTid } from '@/components/charts/ferdigstilte-over-tid';
import { FristIKabal } from '@/components/charts/frist-i-kabal';
import { FristPerYtelse } from '@/components/charts/frist-per-ytelse';
import { SakerPerSakstype } from '@/components/charts/saker-per-sakstype';
import { SakerPerYtelseOgSakstype } from '@/components/charts/saker-per-ytelse-og-sakstype';
import { SendtTilTROverTid } from '@/components/charts/sendt-til-tr-over-tid';
import { TildelteSakerPerKlageenhet } from '@/components/charts/tildelte-saker-per-klageenhet';
import { TildelteSakerPerYtelseOgKlageenhet } from '@/components/charts/tildelte-saker-per-ytelse-og-klageenhet';
import { VarsletFrist } from '@/components/charts/varslet-frist';
import { VarsletFristPerYtelse } from '@/components/charts/varslet-frist-per-ytelse';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { useClientKapteinApiFetch } from '@/lib/client/use-client-fetch';
import type {
  AnkeFerdigstilt,
  BegjæringOmGjenopptakFerdigstilt,
  BegjæringOmGjenopptakFerdigstilteResponse,
  BetongFerdigstilt,
  BetongFerdigstilteResponse,
  IKodeverkSimpleValue,
  IYtelse,
  KapteinApiResponse,
  KlageFerdigstilt,
  OmgjøringskravFerdigstilt,
  OmgjøringskravFerdigstilteResponse,
  SakITRUtfall,
  Sakstype,
  Utfall,
} from '@/lib/types';

type KlageResponse = KapteinApiResponse<KlageFerdigstilt>;
type AnkeResponse = KapteinApiResponse<AnkeFerdigstilt>;

interface KodeverkProps {
  ytelser: IYtelse[];
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
  klageenheter: IKodeverkSimpleValue[];
  utfall: IKodeverkSimpleValue<Utfall | SakITRUtfall>[];
}

export const Behandlinger = (kodeverk: KodeverkProps) => {
  const {
    data: klager,
    isLoading: isLoadingKlager,
    error: errorKlager,
  } = useClientKapteinApiFetch<KlageResponse>('/klager/ferdigstilte');
  const {
    data: anker,
    isLoading: isLoadingAnker,
    error: errorAnker,
  } = useClientKapteinApiFetch<AnkeResponse>('/anker/ferdigstilte');
  const {
    data: betongFerdigstilte,
    isLoading: betongFerdigstilteLoading,
    error: betongFerdigstilteError,
  } = useClientKapteinApiFetch<BetongFerdigstilteResponse>('/behandlinger-etter-tr-opphevet/ferdigstilte');
  const {
    data: omgjøringskravFerdigstilte,
    isLoading: omgjøringskravFerdigstilteLoading,
    error: omgjøringskravFerdigstilteError,
  } = useClientKapteinApiFetch<OmgjøringskravFerdigstilteResponse>('/omgjoeringskrav/ferdigstilte');
  const {
    data: ferdigstilteGb,
    isLoading: isLoadingFerdigstilteGb,
    error: errorFerdigstilteGb,
  } = useClientKapteinApiFetch<BegjæringOmGjenopptakFerdigstilteResponse>('/begjaeringer-om-gjenopptak/ferdigstilte');

  if (
    isLoadingKlager ||
    isLoadingAnker ||
    betongFerdigstilteLoading ||
    omgjøringskravFerdigstilteLoading ||
    isLoadingFerdigstilteGb
  ) {
    return <Skeleton />;
  }

  if (errorKlager !== null) {
    return <LoadingError>Feil ved lasting av data: {errorKlager}</LoadingError>;
  }

  if (errorAnker !== null) {
    return <LoadingError>Feil ved lasting av data: {errorAnker}</LoadingError>;
  }

  if (betongFerdigstilteError !== null) {
    return <LoadingError>Feil ved lasting av data: {betongFerdigstilteError}</LoadingError>;
  }

  if (omgjøringskravFerdigstilteError !== null) {
    return <LoadingError>Feil ved lasting av data: {omgjøringskravFerdigstilteError}</LoadingError>;
  }

  if (errorFerdigstilteGb !== null) {
    return <LoadingError>Feil ved lasting av data: {errorFerdigstilteGb}</LoadingError>;
  }

  return (
    <BehandlingerData
      {...kodeverk}
      klager={klager.behandlinger}
      anker={anker.behandlinger}
      betong={betongFerdigstilte.behandlinger}
      omgjøringskrav={omgjøringskravFerdigstilte.behandlinger}
      begjæringerOmGjenopptak={ferdigstilteGb.behandlinger}
    />
  );
};

interface DataProps extends KodeverkProps {
  klager: KlageFerdigstilt[];
  anker: AnkeFerdigstilt[];
  betong: BetongFerdigstilt[];
  omgjøringskrav: OmgjøringskravFerdigstilt[];
  begjæringerOmGjenopptak: BegjæringOmGjenopptakFerdigstilt[];
}

const BehandlingerData = ({
  klager,
  anker,
  betong,
  omgjøringskrav,
  begjæringerOmGjenopptak,
  sakstyper,
  ytelser,
  klageenheter,
  utfall,
}: DataProps) => {
  const behandlinger = [...klager, ...anker, ...betong, ...omgjøringskrav, ...begjæringerOmGjenopptak];
  const filteredBehandlinger = useFerdigstilteInPeriod(behandlinger);

  const filteredAnker = useRegistreringshjemlerFiltered(useBaseFiltered(anker));

  const relevantYtelser = useRelevantYtelser(filteredBehandlinger, ytelser);

  return (
    <ChartsWrapper>
      <Card span={4}>
        <FerdigstilteOverTid
          title="Ferdigstilte over tid"
          description={`Viser data for ${filteredBehandlinger.length} ferdigstilte saker`}
          ferdigstilte={filteredBehandlinger}
        />
      </Card>

      <Card span={4}>
        <SendtTilTROverTid
          title="Anker sendt til Trygderetten"
          helpText={SENT_TIL_TR_OVER_TID_HELP_TEXT}
          ferdigstilte={filteredAnker}
          utfall={utfall}
        />
      </Card>

      <Card span={4}>
        <SakerPerYtelseOgSakstype
          title="Ferdigstilte saker per ytelse og sakstype"
          description={`Viser data for ${filteredBehandlinger.length} ferdigstilte saker`}
          behandlinger={filteredBehandlinger}
          sakstyper={sakstyper}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card>
        <SakerPerSakstype
          title="Ferdigstilte saker per sakstype"
          description={`Viser data for ${filteredBehandlinger.length} ferdigstilte saker`}
          behandlinger={filteredBehandlinger}
          sakstyper={sakstyper}
        />
      </Card>

      <Card>
        <TildelteSakerPerKlageenhet
          title="Ferdigstilte saker per klageenhet"
          description={`Viser data for ${filteredBehandlinger.length} ferdigstilte saker`}
          behandlinger={filteredBehandlinger}
          klageenheter={klageenheter}
        />
      </Card>

      <Card span={4}>
        <TildelteSakerPerYtelseOgKlageenhet
          title="Ferdigstilte saker per ytelse og klageenhet"
          description={`Viser data for ${filteredBehandlinger.length} ferdigstilte saker`}
          behandlinger={filteredBehandlinger}
          klageenheter={klageenheter}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card>
        <VarsletFrist
          title="Varslet frist"
          description={`Viser data for ${filteredBehandlinger.length} ferdigstilte saker`}
          helpText={VARSLET_FRIST_HELP_TEXT}
          behandlinger={filteredBehandlinger}
        />
      </Card>

      <Card>
        <FristIKabal
          title="Frist i Kabal"
          description={`Viser data for ${filteredBehandlinger.length} ferdigstilte saker`}
          helpText={FRIST_I_KABAL_HELP_TEXT}
          behandlinger={filteredBehandlinger}
        />
      </Card>

      <Card span={4}>
        <VarsletFristPerYtelse
          title="Varslet frist per ytelse"
          description={`Viser data for ${filteredBehandlinger.length} ferdigstilte saker`}
          helpText={VARSLET_FRIST_HELP_TEXT}
          behandlinger={filteredBehandlinger}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card span={4}>
        <FristPerYtelse
          title="Frist per ytelse"
          description={`Viser data for ${filteredBehandlinger.length} ferdigstilte saker`}
          helpText={FRIST_I_KABAL_HELP_TEXT}
          behandlinger={filteredBehandlinger}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card span={2}>
        <DaysThresholdPieChart
          title="Behandlingstid"
          description={`Viser data for ${filteredBehandlinger.length} ferdigstilte saker`}
          helpText={BEHANDLINGSTID_HELP_TEXT}
          behandlinger={filteredBehandlinger}
          getDays={(b) => b.behandlingstid}
        />
      </Card>

      <Card span={4}>
        <DaysThresholdPerYtelse
          title="Behandlingstid per ytelse"
          description={`Viser data for ${filteredBehandlinger.length} ferdigstilte saker`}
          helpText={BEHANDLINGSTID_HELP_TEXT}
          behandlinger={filteredBehandlinger}
          relevantYtelser={relevantYtelser}
          getDays={(b) => b.behandlingstid}
        />
      </Card>
    </ChartsWrapper>
  );
};

const SENT_TIL_TR_OVER_TID_HELP_TEXT = (
  <>
    <BodyLong spacing>
      Viser antall{' '}
      <Tag variant="success" size="xsmall">
        anker
      </Tag>{' '}
      sendt til Trygderetten per måned, og fordeling av utfallene som innebærer at anken går til Trygderetten.
    </BodyLong>

    <BodyLong spacing>
      Trykk på{' '}
      <Tag variant="info" size="xsmall">
        Prosent
      </Tag>{' '}
      for å se andel{' '}
      <Tag variant="success" size="xsmall">
        anker
      </Tag>{' '}
      sendt til Trygderetten av totalt ferdigstilte{' '}
      <Tag variant="success" size="xsmall">
        anker
      </Tag>{' '}
      per måned, med fordeling av utfall som innebærer at saken går til Trygderetten.
    </BodyLong>

    <BodyLong className="italic">Ikke påvirket av filtere for sakstype eller utfall.</BodyLong>
  </>
);
const VARSLET_FRIST_HELP_TEXT =
  'Varslet frist regnes som overskredet dersom saken ble ferdigstilt i Kabal etter dato for varslet frist. Varslet frist regnes som innenfor dersom saken ble ferdigstilt i Kabal samme dag som varslet frist eller før.';
const FRIST_I_KABAL_HELP_TEXT =
  'Frist i Kabal regnes som overskredet dersom saken ble ferdigstilt i Kabal etter dato for frist i Kabal. Frist i Kabal regnes som innenfor dersom saken ble ferdigstilt i Kabal samme dag som frist i Kabal eller før.';
const BEHANDLINGSTID_HELP_TEXT = 'Behandlingstid regnes fra dato mottatt klageinstans til dato ferdigstilt i Kabal.';
