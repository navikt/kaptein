'use client';

import {
  differenceInCalendarMonths,
  differenceInDays,
  differenceInWeeks,
  eachMonthOfInterval,
  endOfDay,
  format,
  fromUnixTime,
  isAfter,
  isBefore,
  min,
  parse,
  subDays,
} from 'date-fns';
import { nb } from 'date-fns/locale';
import { Card } from '@/components/cards';
import { BehandlingstidIKlageinstans } from '@/components/charts/behandlingstid-i-klageinstans';
import { LoadingError } from '@/components/charts/common/loading-error';
import { SkeletonBehandlingstid } from '@/components/charts/common/skeleton-chart';
import { useFerdigstilteInPeriod } from '@/components/charts/common/use-data';
import { type Buckets, IntervalOverTime } from '@/components/charts/interval-over-time';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { useClientKapteinApiFetch } from '@/lib/client/use-client-fetch';
import { ISO_DATE_FORMAT, PRETTY_DATE_FORMAT } from '@/lib/date';
import type {
  AnkeFerdigstilt,
  Avsluttet,
  BaseBehandling,
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
  const filteredKlager = useFerdigstilteInPeriod(klager);
  const filteredAnker = useFerdigstilteInPeriod(anker);
  const filteredBetong = useFerdigstilteInPeriod(betong);
  const filteredOmgjøringskrav = useFerdigstilteInPeriod(omgjøringskrav);
  const behandlinger = [...filteredKlager, ...filteredAnker, ...filteredBetong, ...filteredOmgjøringskrav];

  return (
    <ChartsWrapper>
      <Card fullWidth span={3}>
        <BehandlingstidIKlageinstans
          title="Behandlingstid i klageinstans"
          helpText={BEHANDLINGSTID_HELP_TEXT}
          ferdigstilte={behandlinger}
        />
      </Card>
      <Card fullWidth span={3}>
        <IntervalOverTime
          title="Behandlingstid over tid (uker)"
          helpText={BEHANDLINGSTID_HELP_TEXT}
          xAxisLabel="Ferdigstilt"
          behandlinger={behandlinger}
          getValue={getBehandlingstid}
          getBucketKey={getBehandlingstidWeekBucketKey}
          createBuckets={createWeekBuckets}
        />
      </Card>
      <Card fullWidth span={3}>
        <IntervalOverTime
          title="Behandlingstid over tid (måneder)"
          helpText={BEHANDLINGSTID_HELP_TEXT}
          xAxisLabel="Ferdigstilt"
          behandlinger={behandlinger}
          getValue={getBehandlingstid}
          getBucketKey={getBehandlingstidMonthBucketKey}
          createBuckets={createMonthBuckets}
        />
      </Card>
    </ChartsWrapper>
  );
};

const BEHANDLINGSTID_HELP_TEXT = 'Behandlingstid regnes fra dato mottatt klageinstans til dato ferdigstilt i Kabal.';

const SECONDS_IN_A_WEEK = 7 * 24 * 60 * 60;
const MS_IN_A_WEEK = SECONDS_IN_A_WEEK * 1000;

const createWeekBuckets = (from: Date, to: Date) => {
  const buckets: Buckets = {};

  for (let i = 0, t = from.getTime(); t <= to.getTime(); t += MS_IN_A_WEEK, i++) {
    buckets[i] = { label: getWeekLabel(fromUnixTime(t / 1000), to), values: [] };
  }

  return buckets;
};

const getWeekLabel = (date: Date, maxDate: Date) => {
  const from = format(date, PRETTY_DATE_FORMAT);
  const weekEnd = subDays(date.getTime() + MS_IN_A_WEEK, 1);
  const to = format(min([weekEnd, maxDate]), PRETTY_DATE_FORMAT);

  return `${from} - ${to}`;
};

const createMonthBuckets = (from: Date, to: Date): Buckets => {
  const monthStarts = eachMonthOfInterval({ start: from, end: to });

  const buckets: Buckets = {};

  for (const monthStart of monthStarts) {
    const relativeMonthNumber = differenceInCalendarMonths(monthStart, from);

    buckets[relativeMonthNumber] = { values: [], label: format(monthStart, 'LLL yy', { locale: nb }) };
  }

  return buckets;
};

const getBehandlingstidWeekBucketKey = (b: Avsluttet, from: Date, to: Date) => {
  const finished = parse(b.avsluttetAvSaksbehandlerDate, ISO_DATE_FORMAT, new Date());

  if (isBefore(finished, from) || isAfter(finished, endOfDay(to))) {
    return null;
  }

  return differenceInWeeks(finished, from);
};

const getBehandlingstidMonthBucketKey = (b: Avsluttet, from: Date, to: Date) => {
  const finished = parse(b.avsluttetAvSaksbehandlerDate, ISO_DATE_FORMAT, new Date());

  if (isBefore(finished, from) || isAfter(finished, endOfDay(to))) {
    return null;
  }

  return differenceInCalendarMonths(finished, from);
};

const getBehandlingstid = (b: BaseBehandling & Avsluttet) =>
  differenceInDays(
    parse(b.avsluttetAvSaksbehandlerDate, ISO_DATE_FORMAT, new Date()),
    parse(b.mottattKlageinstans, ISO_DATE_FORMAT, new Date()),
  );
