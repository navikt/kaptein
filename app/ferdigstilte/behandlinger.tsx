'use client';

import { Skeleton } from '@/app/ferdigstilte/skeleton';
import { Card } from '@/components/cards';
import { LoadingError } from '@/components/charts/common/loading-error';
import { useFerdigstilteInPeriod } from '@/components/charts/common/use-data';
import { useRelevantYtelser } from '@/components/charts/common/use-relevant-ytelser';
import { DaysThresholdPieChart } from '@/components/charts/days-threshold';
import { DaysThresholdPerYtelse } from '@/components/charts/days-threshold-per-ytelse';
import { FristIKabal } from '@/components/charts/frist-i-kabal';
import { FristPerYtelse } from '@/components/charts/frist-per-ytelse';
import { SakerPerSakstype } from '@/components/charts/saker-per-sakstype';
import { SakerPerYtelseOgSakstype } from '@/components/charts/saker-per-ytelse-og-sakstype';
import { TildelteSakerPerKlageenhet } from '@/components/charts/tildelte-saker-per-klageenhet';
import { TildelteSakerPerYtelseOgKlageenhet } from '@/components/charts/tildelte-saker-per-ytelse-og-klageenhet';
import { VarsletFrist } from '@/components/charts/varslet-frist';
import { VarsletFristPerYtelse } from '@/components/charts/varslet-frist-per-ytelse';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { useClientKapteinApiFetch } from '@/lib/client/use-client-fetch';
import type {
  AnkeFerdigstilt,
  BetongFerdigstilt,
  BetongFerdigstilteResponse,
  IKodeverkSimpleValue,
  IYtelse,
  KapteinApiResponse,
  KlageFerdigstilt,
  OmgjøringskravFerdigstilt,
  OmgjøringskravFerdigstilteResponse,
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

  if (isLoadingKlager || isLoadingAnker || betongFerdigstilteLoading || omgjøringskravFerdigstilteLoading) {
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

  return (
    <BehandlingerData
      {...kodeverk}
      klager={klager.behandlinger}
      anker={anker.behandlinger}
      betong={betongFerdigstilte.behandlinger}
      omgjøringskrav={omgjøringskravFerdigstilte.behandlinger}
    />
  );
};

interface DataProps extends KodeverkProps {
  klager: KlageFerdigstilt[];
  anker: AnkeFerdigstilt[];
  betong: BetongFerdigstilt[];
  omgjøringskrav: OmgjøringskravFerdigstilt[];
}

const BehandlingerData = ({ klager, anker, betong, omgjøringskrav, sakstyper, ytelser, klageenheter }: DataProps) => {
  const filteredKlager = useFerdigstilteInPeriod(klager);
  const filteredAnker = useFerdigstilteInPeriod(anker);
  const filteredBetong = useFerdigstilteInPeriod(betong);
  const filteredOmgjøringskrav = useFerdigstilteInPeriod(omgjøringskrav);
  const behandlinger = [...filteredKlager, ...filteredAnker, ...filteredBetong, ...filteredOmgjøringskrav];
  const relevantYtelser = useRelevantYtelser(behandlinger, ytelser);

  return (
    <ChartsWrapper>
      <Card span={4}>
        <SakerPerYtelseOgSakstype
          title="Ferdigstilte saker per ytelse og sakstype"
          description={`Viser data for ${behandlinger.length} ferdigstilte saker`}
          behandlinger={behandlinger}
          sakstyper={sakstyper}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card>
        <SakerPerSakstype
          title="Ferdigstilte saker per sakstype"
          description={`Viser data for ${behandlinger.length} ferdigstilte saker`}
          behandlinger={behandlinger}
          sakstyper={sakstyper}
        />
      </Card>

      <Card>
        <TildelteSakerPerKlageenhet
          title="Ferdigstilte saker per klageenhet"
          description={`Viser data for ${behandlinger.length} ferdigstilte saker`}
          behandlinger={behandlinger}
          klageenheter={klageenheter}
        />
      </Card>

      <Card span={4}>
        <TildelteSakerPerYtelseOgKlageenhet
          title="Ferdigstilte saker per ytelse og klageenhet"
          description={`Viser data for ${behandlinger.length} ferdigstilte saker`}
          behandlinger={behandlinger}
          klageenheter={klageenheter}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card>
        <VarsletFrist
          title="Varslet frist"
          description={`Viser data for ${behandlinger.length} ferdigstilte saker`}
          helpText={VARSLET_FRIST_HELP_TEXT}
          behandlinger={behandlinger}
        />
      </Card>

      <Card>
        <FristIKabal
          title="Frist i Kabal"
          description={`Viser data for ${behandlinger.length} ferdigstilte saker`}
          helpText={FRIST_I_KABAL_HELP_TEXT}
          behandlinger={behandlinger}
        />
      </Card>

      <Card span={4}>
        <VarsletFristPerYtelse
          title="Varslet frist per ytelse"
          description={`Viser data for ${behandlinger.length} ferdigstilte saker`}
          helpText={VARSLET_FRIST_HELP_TEXT}
          behandlinger={behandlinger}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card span={4}>
        <FristPerYtelse
          title="Frist per ytelse"
          description={`Viser data for ${behandlinger.length} ferdigstilte saker`}
          helpText={FRIST_I_KABAL_HELP_TEXT}
          behandlinger={behandlinger}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card span={2}>
        <DaysThresholdPieChart
          title="Behandlingstid"
          description={`Viser data for ${behandlinger.length} ferdigstilte saker`}
          helpText={BEHANDLINGSTID_HELP_TEXT}
          behandlinger={behandlinger}
          getDays={(b) => b.behandlingstid}
        />
      </Card>

      <Card span={4}>
        <DaysThresholdPerYtelse
          title="Behandlingstid per ytelse"
          description={`Viser data for ${behandlinger.length} ferdigstilte saker`}
          helpText={BEHANDLINGSTID_HELP_TEXT}
          behandlinger={behandlinger}
          relevantYtelser={relevantYtelser}
          getDays={(b) => b.behandlingstid}
        />
      </Card>
    </ChartsWrapper>
  );
};

const VARSLET_FRIST_HELP_TEXT =
  'Varslet frist regnes som overskredet dersom saken ble ferdigstilt i Kabal etter dato for varslet frist. Varslet frist regnes som innenfor dersom saken ble ferdigstilt i Kabal samme dag som varslet frist eller før.';
const FRIST_I_KABAL_HELP_TEXT =
  'Frist i Kabal regnes som overskredet dersom saken ble ferdigstilt i Kabal etter dato for frist i Kabal. Frist i Kabal regnes som innenfor dersom saken ble ferdigstilt i Kabal samme dag som frist i Kabal eller før.';
const BEHANDLINGSTID_HELP_TEXT = 'Behandlingstid regnes fra dato mottatt klageinstans til dato ferdigstilt i Kabal.';
