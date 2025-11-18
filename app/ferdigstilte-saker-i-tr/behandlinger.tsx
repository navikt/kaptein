'use client';

import { BodyShort } from '@navikt/ds-react';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { parseAsHjemlerModeFilter } from '@/app/custom-query-parsers';
import { Skeleton } from '@/app/ferdigstilte-saker-i-tr/skeleton';
import { Card } from '@/components/cards';
import { filterHjemler } from '@/components/charts/common/filter-hjemler';
import { LoadingError } from '@/components/charts/common/loading-error';
import { useBaseFiltered, useFerdigstiltInPeriod, useSentInPeriod } from '@/components/charts/common/use-data';
import { useRelevantYtelser } from '@/components/charts/common/use-relevant-ytelser';
import { DaysThresholdPieChart } from '@/components/charts/days-threshold';
import { DaysThresholdPerYtelse } from '@/components/charts/days-threshold-per-ytelse';
import { HjemlerOmgjort } from '@/components/charts/hjemler-omgjort';
import { Tidsfordeling } from '@/components/charts/tidsfordeling';
import { TildelteSakerPerKlageenhetOgYtelse } from '@/components/charts/tildelte-saker-per-klageenhet-og-ytelse';
import { TildelteSakerPerYtelseOgKlageenhet } from '@/components/charts/tildelte-saker-per-ytelse-og-klageenhet';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { OmgjøringsprosentOverTid } from '@/components/key-stats/omgjøringsprosent';
import { TypeTag } from '@/components/type-tag/type-tag';
import { useClientKapteinApiFetch } from '@/lib/client/use-client-fetch';
import {
  type AnkeITRFerdigstilt,
  type AnkeITRLedig,
  type AnkeITRTildelt,
  type AnkerITRFerdigstilteResponse,
  type AnkerITRLedigeResponse,
  type AnkerITRTildelteResponse,
  type BaseSakITR,
  type BegjæringOmGjenopptakITRFerdigstilt,
  type BegjæringOmGjenopptakITRFerdigstilteResponse,
  type BegjæringOmGjenopptakITRLedig,
  type BegjæringOmGjenopptakITRLedigeResponse,
  type BegjæringOmGjenopptakITRTildelt,
  type BegjæringOmGjenopptakITRTildelteResponse,
  type FerdigstiltSakITR,
  type IKodeverkSimpleValue,
  type IYtelse,
  type RegistreringshjemlerMap,
  type SakITRUtfall,
  Sakstype,
  type Utfall,
} from '@/lib/types';
import { QueryParam } from '@/lib/types/query-param';

interface KodeverkProps {
  ytelser: IYtelse[];
  klageenheter: IKodeverkSimpleValue[];
  registreringshjemlerMap: RegistreringshjemlerMap;
  utfall: IKodeverkSimpleValue<Utfall | SakITRUtfall>[];
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
    data: ferdigstilteAnker,
    isLoading: isLoadingFerdigstilteAnker,
    error: errorFerdigstilteAnker,
  } = useClientKapteinApiFetch<AnkerITRFerdigstilteResponse>('/anker-i-tr/ferdigstilte');
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
  const {
    data: ferdigstilteGb,
    isLoading: isLoadingFerdigstilteGb,
    error: errorFerdigstilteGb,
  } = useClientKapteinApiFetch<BegjæringOmGjenopptakITRFerdigstilteResponse>(
    '/begjaeringer-om-gjenopptak-i-tr/ferdigstilte',
  );

  if (
    isLoadingFerdigstilteAnker ||
    isLoadingLedigeAnker ||
    isLoadingTildelteAnker ||
    isLoadingFerdigstilteGb ||
    isLoadingLedigeGb ||
    isLoadingTildelteGb
  ) {
    return <Skeleton />;
  }

  if (errorLedigeAnker !== null) {
    return <LoadingError>Feil ved lasting av data: {errorLedigeAnker}</LoadingError>;
  }

  if (errorTildelteAnker !== null) {
    return <LoadingError>Feil ved lasting av data: {errorTildelteAnker}</LoadingError>;
  }

  if (errorFerdigstilteAnker !== null) {
    return <LoadingError>Feil ved lasting av data: {errorFerdigstilteAnker}</LoadingError>;
  }

  if (errorLedigeGb !== null) {
    return <LoadingError>Feil ved lasting av data: {errorLedigeGb}</LoadingError>;
  }

  if (errorTildelteGb !== null) {
    return <LoadingError>Feil ved lasting av data: {errorTildelteGb}</LoadingError>;
  }

  if (errorFerdigstilteGb !== null) {
    return <LoadingError>Feil ved lasting av data: {errorFerdigstilteGb}</LoadingError>;
  }

  return (
    <BehandlingerData
      {...kodeverk}
      ledigeAnker={ledigeAnker.behandlinger}
      tildelteAnker={tildelteAnker.behandlinger}
      ferdigstilteAnker={ferdigstilteAnker.behandlinger}
      ledigeGb={ledigeGb.behandlinger}
      tildelteGb={tildelteGb.behandlinger}
      ferdigstilteGb={ferdigstilteGb.behandlinger}
    />
  );
};

interface DataProps extends KodeverkProps {
  ledigeAnker: AnkeITRLedig[];
  tildelteAnker: AnkeITRTildelt[];
  ferdigstilteAnker: AnkeITRFerdigstilt[];
  ledigeGb: BegjæringOmGjenopptakITRLedig[];
  tildelteGb: BegjæringOmGjenopptakITRTildelt[];
  ferdigstilteGb: BegjæringOmGjenopptakITRFerdigstilt[];
}

const BehandlingerData = ({
  ledigeAnker,
  tildelteAnker,
  ferdigstilteAnker,
  ledigeGb,
  tildelteGb,
  ferdigstilteGb,
  ytelser,
  klageenheter,
  registreringshjemlerMap,
  utfall,
}: DataProps) => {
  const baseFilteredFerdigstilte = useSakITRFilter(
    useUtfallFilter(useBaseFiltered([...ferdigstilteAnker, ...ferdigstilteGb])),
  );
  const ferdigstilteInPeriod = useFerdigstiltInPeriod(baseFilteredFerdigstilte);
  const sentInPeriodFerdigstilte = useSentInPeriod(baseFilteredFerdigstilte);
  const uferdige = [...ledigeAnker, ...tildelteAnker, ...ledigeGb, ...tildelteGb];
  const baseFilteredUferdige = useSakITRFilter(useBaseFiltered(uferdige));
  const sentInPeriodUferdige = useSentInPeriod(baseFilteredUferdige);
  const relevantYtelser = useRelevantYtelser(ferdigstilteInPeriod, ytelser);

  return (
    <ChartsWrapper>
      <Card
        span={4}
        helpContent={
          <>
            <BodyShort spacing>
              Sakene er filtrert etter når de ble sendt til Trygderetten, uavhengig av når de ble ferdigstilt.
            </BodyShort>
            <BodyShort>
              Den grå linjen er saker som er sendt til Trygderetten i valgt periode, men som fortsatt er aktive. Den grå
              linjen indikerer hvor ufullstendig omgjøringsprosenten er for hver måned.
            </BodyShort>
          </>
        }
      >
        <OmgjøringsprosentOverTid
          uferdige={sentInPeriodUferdige}
          ferdigstilte={sentInPeriodFerdigstilte}
          utfall={utfall}
        />
      </Card>

      <Card span={4}>
        <HjemlerOmgjort
          title="Topp 30 omgjorte hjemler"
          description={`Viser data for ${ferdigstilteInPeriod.length} ferdigstilte saker i TR`}
          maxHjemler={30}
          behandlinger={ferdigstilteInPeriod}
          klageenheter={klageenheter}
          ytelser={ytelser}
          registreringshjemlerMap={registreringshjemlerMap}
        />
      </Card>

      <Card span={3}>
        <TildelteSakerPerKlageenhetOgYtelse
          title="Ferdigstilte saker i TR per klageenhet og ytelse"
          description={`Viser data for ${ferdigstilteInPeriod.length} ferdigstilte saker i TR`}
          helpText={ANKE_I_TR_HELP_TEXT}
          behandlinger={ferdigstilteInPeriod}
          klageenheter={klageenheter}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card span={4}>
        <TildelteSakerPerYtelseOgKlageenhet
          title="Ferdigstilte saker i TR per ytelse og klageenhet"
          description={`Viser data for ${ferdigstilteInPeriod.length} ferdigstilte saker i TR`}
          helpText={ANKE_I_TR_HELP_TEXT}
          behandlinger={ferdigstilteInPeriod}
          klageenheter={klageenheter}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card span={4}>
        <Tidsfordeling
          title="Behandlingstid"
          helpText={BEHANDLINGSTID_HELP_TEXT}
          caseType="Ferdigstilte"
          behandlinger={ferdigstilteInPeriod}
          getDays={(b) => b.behandlingstid}
        />
      </Card>

      <Card span={2}>
        <DaysThresholdPieChart
          title="Behandlingstid"
          description={`Viser data for ${ferdigstilteInPeriod.length} ferdigstilte saker i TR`}
          helpText={BEHANDLINGSTID_HELP_TEXT}
          behandlinger={ferdigstilteInPeriod}
          getDays={(b) => b.behandlingstid}
        />
      </Card>

      <Card span={4}>
        <DaysThresholdPerYtelse
          title="Behandlingstid per ytelse"
          helpText={BEHANDLINGSTID_HELP_TEXT}
          description={`Viser data for ${ferdigstilteInPeriod.length} ferdigstilte saker i TR`}
          behandlinger={ferdigstilteInPeriod}
          relevantYtelser={relevantYtelser}
          getDays={(b) => b.behandlingstid}
        />
      </Card>
    </ChartsWrapper>
  );
};

const ANKE_I_TR_HELP_TEXT = (
  <>
    Viser <TypeTag type={Sakstype.ANKE_I_TRYGDERETTEN} />
    -oppgaver som er ferdigstilt i valgt periode. Ferdigstilt <TypeTag type={Sakstype.ANKE_I_TRYGDERETTEN} />
    -oppgave knyttes til samme klageenhet som den ferdigstilte <TypeTag type={Sakstype.ANKE} />
    -oppgaven i Kabal som førte til opprettelsen av <TypeTag type={Sakstype.ANKE_I_TRYGDERETTEN} />
    -oppgaven. Dersom vi mangler teknisk informasjon om hvilken klageenhet som ferdigstilte{' '}
    <TypeTag type={Sakstype.ANKE} />
    -oppgaven i Kabal, knyttes saken til enheten som ferdigstilte <TypeTag type={Sakstype.ANKE_I_TRYGDERETTEN} />
    -oppgaven.
  </>
);

const BEHANDLINGSTID_HELP_TEXT = (
  <>
    Behandlingstid regnes fra <TypeTag type={Sakstype.ANKE} />
    -oppgaven ble ferdigstilt / <TypeTag type={Sakstype.ANKE_I_TRYGDERETTEN} />
    -oppgaven ble opprettet til dato <TypeTag type={Sakstype.ANKE_I_TRYGDERETTEN} />
    -oppgaven ble ferdigstilt i Kabal.
  </>
);

const useSakITRFilter = <T extends BaseSakITR>(behandlinger: T[]) => {
  const [registreringshjemlerFilter] = useQueryState(QueryParam.REGISTRERINGSHJEMLER, parseAsArrayOf(parseAsString));
  const [hjemmelModeFilter] = useQueryState(QueryParam.REGISTRERINGSHJEMLER_MODE, parseAsHjemlerModeFilter);

  return useMemo(() => {
    return filterHjemler(
      behandlinger,
      registreringshjemlerFilter,
      hjemmelModeFilter,
      (b) => b.previousRegistreringshjemmelIdList ?? [],
    );
  }, [behandlinger, registreringshjemlerFilter, hjemmelModeFilter]);
};

const useUtfallFilter = <T extends FerdigstiltSakITR>(behandlinger: T[]) => {
  const [utfallFilter] = useQueryState(QueryParam.UTFALL, parseAsArrayOf(parseAsString));

  return useMemo(() => {
    return utfallFilter === null || utfallFilter.length === 0
      ? behandlinger
      : behandlinger.filter(({ resultat }) => resultat !== null && utfallFilter.includes(resultat.utfallId));
  }, [behandlinger, utfallFilter]);
};
