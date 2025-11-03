'use client';

import { BodyLong, BodyShort } from '@navikt/ds-react';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { Skeleton } from '@/app/aktive-anker-i-tr/skeleton';
import { parseAsHjemlerModeFilter } from '@/app/custom-query-parsers';
import { Card } from '@/components/cards';
import { filterHjemler } from '@/components/charts/common/filter-hjemler';
import { LoadingError } from '@/components/charts/common/loading-error';
import { useBaseFiltered } from '@/components/charts/common/use-data';
import { useRelevantYtelser } from '@/components/charts/common/use-relevant-ytelser';
import { DaysThresholdPieChart } from '@/components/charts/days-threshold';
import { DaysThresholdPerYtelse } from '@/components/charts/days-threshold-per-ytelse';
import { Tidsfordeling } from '@/components/charts/tidsfordeling';
import { TildelteSakerPerKlageenhetOgYtelse } from '@/components/charts/tildelte-saker-per-klageenhet-og-ytelse';
import { TildelteSakerPerYtelseOgKlageenhet } from '@/components/charts/tildelte-saker-per-ytelse-og-klageenhet';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { TypeTag } from '@/components/type-tag/type-tag';
import { useClientKapteinApiFetch } from '@/lib/client/use-client-fetch';
import {
  type AnkeITRLedig,
  type AnkeITRTildelt,
  type AnkerITRLedigeResponse,
  type AnkerITRTildelteResponse,
  type BaseAnkeITR,
  type IKodeverkSimpleValue,
  type IYtelse,
  Sakstype,
} from '@/lib/types';
import { QueryParam } from '@/lib/types/query-param';

interface KodeverkProps {
  ytelser: IYtelse[];
  klageenheter: IKodeverkSimpleValue[];
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

  if (isLoadingLedige || isLoadingTildelte) {
    return <Skeleton />;
  }

  if (errorLedige !== null) {
    return <LoadingError>Feil ved lasting av data: {errorLedige}</LoadingError>;
  }

  if (errorTildelte !== null) {
    return <LoadingError>Feil ved lasting av data: {errorTildelte}</LoadingError>;
  }

  return <BehandlingerData {...kodeverk} ledige={ledige.behandlinger} tildelte={tildelte.behandlinger} />;
};

interface DataProps extends KodeverkProps {
  ledige: AnkeITRLedig[];
  tildelte: AnkeITRTildelt[];
}

const BehandlingerData = ({ ledige, tildelte, ytelser, klageenheter }: DataProps) => {
  const ledigeFiltered = useAnkeITRFilter(useBaseFiltered(ledige));
  const tildelteFiltered = useAnkeITRFilter(useBaseFiltered(tildelte));

  const uferdige = useMemo(
    () => [
      ...ledigeFiltered.map<BaseAnkeITR & { tildeltEnhet: string }>((b) => ({
        ...b,
        tildeltEnhet: b.tildeltEnhet ?? '4293',
      })),
      ...tildelteFiltered,
    ],
    [ledigeFiltered, tildelteFiltered],
  );
  const relevantYtelser = useRelevantYtelser([...ledigeFiltered, ...tildelteFiltered], ytelser);

  return (
    <ChartsWrapper>
      <Card span={3}>
        <TildelteSakerPerKlageenhetOgYtelse
          title="Aktive anker i TR per klageenhet og ytelse"
          description={`Viser data for ${uferdige.length} aktive anker i TR`}
          helpText={ANKE_I_TR_HELP_TEXT}
          behandlinger={uferdige}
          klageenheter={klageenheter}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card span={4}>
        <TildelteSakerPerYtelseOgKlageenhet
          title="Aktive anker i TR per ytelse og klageenhet"
          description={`Viser data for ${uferdige.length} aktive anker i TR`}
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

      <Card span={4}>
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
