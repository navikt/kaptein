'use client';

import { Card } from '@/components/cards';
import { Behandlingstid } from '@/components/charts/behandlingstid';
import { LoadingError } from '@/components/charts/common/loading-error';
import { SkeletonBehandlingstid } from '@/components/charts/common/skeleton-chart';
import { useFerdigstilte } from '@/components/charts/common/use-data';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { useClientKapteinApiFetch } from '@/lib/client/use-client-fetch';
import type {
  AnkeFerdigstilt,
  BetongFerdigstilt,
  BetongFerdigstilteResponse,
  KapteinApiResponse,
  KlageFerdigstilt,
  OmgjøringskravFerdigstilt,
  OmgjøringskravFerdigstilteResponse,
} from '@/lib/types';

type KlageResponse = KapteinApiResponse<KlageFerdigstilt>;
type AnkeResponse = KapteinApiResponse<AnkeFerdigstilt>;

export const Behandlinger = () => {
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
    return <SkeletonBehandlingstid />;
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
      klager={klager.behandlinger}
      anker={anker.behandlinger}
      betong={betongFerdigstilte.behandlinger}
      omgjøringskrav={omgjøringskravFerdigstilte.behandlinger}
    />
  );
};

interface DataProps {
  klager: KlageFerdigstilt[];
  anker: AnkeFerdigstilt[];
  betong: BetongFerdigstilt[];
  omgjøringskrav: OmgjøringskravFerdigstilt[];
}

const BehandlingerData = ({ klager, anker, betong, omgjøringskrav }: DataProps) => {
  const filteredKlager = useFerdigstilte(klager);
  const filteredAnker = useFerdigstilte(anker);
  const filteredBetong = useFerdigstilte(betong);
  const filteredOmgjøringskrav = useFerdigstilte(omgjøringskrav);
  const behandlinger = [...filteredKlager, ...filteredAnker, ...filteredBetong, ...filteredOmgjøringskrav];

  return (
    <ChartsWrapper>
      <Card fullWidth span={3}>
        <Behandlingstid ferdigstilte={behandlinger} />
      </Card>
    </ChartsWrapper>
  );
};
