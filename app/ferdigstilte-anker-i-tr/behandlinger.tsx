'use client';

import { BodyShort } from '@navikt/ds-react';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { parseAsHjemlerModeFilter } from '@/app/custom-query-parsers';
import { Card } from '@/components/cards';
import { filterHjemler } from '@/components/charts/common/filter-hjemler';
import { LoadingError } from '@/components/charts/common/loading-error';
import { SkeletonFerdigstilte } from '@/components/charts/common/skeleton-chart';
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
  type AnkeITRUtfall,
  type AnkerITRFerdigstilteResponse,
  type AnkerITRLedigeResponse,
  type AnkerITRTildelteResponse,
  type BaseAnkeITR,
  type IKodeverkSimpleValue,
  type IYtelse,
  type RegistreringshjemlerMap,
  Sakstype,
  type Utfall,
} from '@/lib/types';
import { QueryParam } from '@/lib/types/query-param';

interface KodeverkProps {
  ytelser: IYtelse[];
  klageenheter: IKodeverkSimpleValue[];
  registreringshjemlerMap: RegistreringshjemlerMap;
  utfall: IKodeverkSimpleValue<Utfall | AnkeITRUtfall>[];
}

export const Behandlinger = (kodeverk: KodeverkProps) => {
  const {
    data: ledige,
    isLoading: isLoadingLedige,
    error: errorLedige,
  } = useClientKapteinApiFetch<AnkerITRLedigeResponse>('/anker-i-tr/ledige');
  const {
    data: tildelte,
    isLoading: isLoadingTildelte,
    error: errorTildelte,
  } = useClientKapteinApiFetch<AnkerITRTildelteResponse>('/anker-i-tr/tildelte');
  const {
    data: ferdigstilte,
    isLoading: isLoadingFerdigstilte,
    error: errorFerdigstilte,
  } = useClientKapteinApiFetch<AnkerITRFerdigstilteResponse>('/anker-i-tr/ferdigstilte');

  if (isLoadingFerdigstilte || isLoadingLedige || isLoadingTildelte) {
    return <SkeletonFerdigstilte />;
  }

  if (errorFerdigstilte !== null || errorLedige !== null || errorTildelte !== null) {
    return <LoadingError>Feil ved lasting av data: {errorFerdigstilte}</LoadingError>;
  }

  return (
    <BehandlingerData
      {...kodeverk}
      ledige={ledige.behandlinger}
      tildelte={tildelte.behandlinger}
      ferdigstilte={ferdigstilte.behandlinger}
    />
  );
};

interface DataProps extends KodeverkProps {
  ledige: AnkeITRLedig[];
  tildelte: AnkeITRTildelt[];
  ferdigstilte: AnkeITRFerdigstilt[];
}

const BehandlingerData = ({
  ledige,
  tildelte,
  ferdigstilte,
  ytelser,
  klageenheter,
  registreringshjemlerMap,
  utfall,
}: DataProps) => {
  const baseFilteredFerdigstilte = useAnkeITRFilter(useUtfallFilter(useBaseFiltered(ferdigstilte)));
  const ferdigstilteInPeriod = useFerdigstiltInPeriod(baseFilteredFerdigstilte);
  const sentInPeriodFerdigstilte = useSentInPeriod(baseFilteredFerdigstilte);
  const uferdige = [...ledige, ...tildelte];
  const baseFilteredUferdige = useAnkeITRFilter(useBaseFiltered(uferdige));
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
          description={`Viser data for ${ferdigstilteInPeriod.length} ferdigstilte anker i TR`}
          maxHjemler={30}
          behandlinger={ferdigstilteInPeriod}
          klageenheter={klageenheter}
          ytelser={ytelser}
          registreringshjemlerMap={registreringshjemlerMap}
        />
      </Card>

      <Card span={3}>
        <TildelteSakerPerKlageenhetOgYtelse
          title="Ferdigstilte anker i TR per klageenhet og ytelse"
          description={`Viser data for ${ferdigstilteInPeriod.length} ferdigstilte anker i TR`}
          helpText={ANKE_I_TR_HELP_TEXT}
          behandlinger={ferdigstilteInPeriod}
          klageenheter={klageenheter}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card span={4}>
        <TildelteSakerPerYtelseOgKlageenhet
          title="Ferdigstilte anker i TR per ytelse og klageenhet"
          description={`Viser data for ${ferdigstilteInPeriod.length} ferdigstilte anker i TR`}
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
          description={`Viser data for ${ferdigstilteInPeriod.length} ferdigstilte anker i TR`}
          helpText={BEHANDLINGSTID_HELP_TEXT}
          behandlinger={ferdigstilteInPeriod}
          getDays={(b) => b.behandlingstid}
        />
      </Card>

      <Card span={4}>
        <DaysThresholdPerYtelse
          title="Behandlingstid per ytelse"
          helpText={BEHANDLINGSTID_HELP_TEXT}
          description={`Viser data for ${ferdigstilteInPeriod.length} ferdigstilte anker i TR`}
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

const useAnkeITRFilter = <T extends BaseAnkeITR>(behandlinger: T[]) => {
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

const useUtfallFilter = <T extends AnkeITRFerdigstilt>(behandlinger: T[]) => {
  const [utfallFilter] = useQueryState(QueryParam.UTFALL, parseAsArrayOf(parseAsString));

  return useMemo(() => {
    return utfallFilter === null || utfallFilter.length === 0
      ? behandlinger
      : behandlinger.filter(({ resultat }) => resultat !== null && utfallFilter.includes(resultat.utfallId));
  }, [behandlinger, utfallFilter]);
};
