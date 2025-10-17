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
import { useClientKapteinApiFetch } from '@/lib/client/use-client-fetch';
import type {
  AnkeITRFerdigstilt,
  AnkeITRUtfall,
  AnkerITRFerdigstilteResponse,
  IKodeverkSimpleValue,
  IYtelse,
  RegistreringshjemlerMap,
  Utfall,
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
    data: ferdigstilte,
    isLoading: isLoadingFerdigstilte,
    error: errorFerdigstilte,
  } = useClientKapteinApiFetch<AnkerITRFerdigstilteResponse>('/anker-i-tr/ferdigstilte');

  if (isLoadingFerdigstilte) {
    return <SkeletonFerdigstilte />;
  }

  if (errorFerdigstilte !== null) {
    return <LoadingError>Feil ved lasting av data: {errorFerdigstilte}</LoadingError>;
  }

  return <BehandlingerData {...kodeverk} ferdigstilte={ferdigstilte.behandlinger} />;
};

interface DataProps extends KodeverkProps {
  ferdigstilte: AnkeITRFerdigstilt[];
}

const BehandlingerData = ({ ferdigstilte, ytelser, klageenheter, registreringshjemlerMap, utfall }: DataProps) => {
  const baseFiltered = useAnkeITRFilter(useUtfallFilter(useBaseFiltered(ferdigstilte)));
  const ferdigstilteFiltered = useFerdigstiltInPeriod(baseFiltered);
  const relevantYtelser = useRelevantYtelser(ferdigstilteFiltered, ytelser);

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
        <OmgjøringsprosentOverTid behandlinger={useSentInPeriod(baseFiltered)} utfall={utfall} />
      </Card>

      <Card span={4}>
        <HjemlerOmgjort
          title="Topp 30 omgjorte hjemler"
          description={`Viser data for ${ferdigstilteFiltered.length} ferdigstilte anker i TR`}
          maxHjemler={30}
          behandlinger={ferdigstilteFiltered}
          klageenheter={klageenheter}
          ytelser={ytelser}
          registreringshjemlerMap={registreringshjemlerMap}
        />
      </Card>

      <Card span={3}>
        <TildelteSakerPerKlageenhetOgYtelse
          title="Ferdigstilte anker i TR per klageenhet og ytelse"
          description={`Viser data for ${ferdigstilteFiltered.length} ferdigstilte anker i TR`}
          behandlinger={ferdigstilteFiltered}
          klageenheter={klageenheter}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card span={4}>
        <TildelteSakerPerYtelseOgKlageenhet
          title="Ferdigstilte anker i TR per ytelse og klageenhet"
          description={`Viser data for ${ferdigstilteFiltered.length} ferdigstilte anker i TR`}
          behandlinger={ferdigstilteFiltered}
          klageenheter={klageenheter}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card span={4}>
        <Tidsfordeling
          title="Behandlingstid"
          caseType="Ferdigstilte"
          behandlinger={ferdigstilteFiltered}
          getDays={(b) => b.behandlingstid}
        />
      </Card>

      <Card span={2}>
        <DaysThresholdPieChart
          title="Behandlingstid"
          description={`Viser data for ${ferdigstilteFiltered.length} ferdigstilte anker i TR`}
          behandlinger={ferdigstilteFiltered}
          getDays={(b) => b.behandlingstid}
        />
      </Card>

      <Card span={4}>
        <DaysThresholdPerYtelse
          title="Behandlingstid per ytelse"
          description={`Viser data for ${ferdigstilteFiltered.length} ferdigstilte anker i TR`}
          behandlinger={ferdigstilteFiltered}
          relevantYtelser={relevantYtelser}
          getDays={(b) => b.behandlingstid}
        />
      </Card>
    </ChartsWrapper>
  );
};

const useAnkeITRFilter = <T extends AnkeITRFerdigstilt>(behandlinger: T[]) => {
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
