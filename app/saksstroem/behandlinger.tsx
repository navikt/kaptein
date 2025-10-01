'use client';

import { BodyLong, List } from '@navikt/ds-react';
import { differenceInMonths, eachMonthOfInterval, format, min, subDays } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { parseAsLedigeFilter } from '@/app/custom-query-parsers';
import { TildelingFilter } from '@/app/query-types';
import { Card } from '@/components/cards';
import { LoadingError } from '@/components/charts/common/loading-error';
import { SkeletonFerdigstilte } from '@/components/charts/common/skeleton-chart';
import { useSaksstrøm } from '@/components/charts/common/use-data';
import { AntallSakerInnTilKabalFerdigstiltIKabal, type Buckets } from '@/components/charts/inngang-utgang';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { useClientFetch } from '@/lib/client/use-client-fetch';
import { PRETTY_DATE_FORMAT } from '@/lib/date';
import type {
  Behandling,
  FerdigstiltBehandling,
  FerdigstilteResponse,
  LedigBehandling,
  LedigeResponse,
  TildeltBehandling,
  TildelteResponse,
} from '@/lib/server/types';
import { QueryParam } from '@/lib/types/query-param';

export const Behandlinger = () => {
  const {
    data: ledige,
    error: ledigeError,
    isLoading: ledigeLoading,
  } = useClientFetch<LedigeResponse>('/api/behandlinger/ledige');
  const {
    data: tildelte,
    error: tildelteError,
    isLoading: tildelteLoading,
  } = useClientFetch<TildelteResponse>('/api/behandlinger/tildelte');
  const {
    data: ferdigstilte,
    isLoading: ferdigstilteLoading,
    error: ferdigstilteError,
  } = useClientFetch<FerdigstilteResponse>('/api/behandlinger/ferdigstilte');

  if (ledigeLoading || tildelteLoading || ferdigstilteLoading) {
    return <SkeletonFerdigstilte />;
  }

  if (ledigeError !== null || tildelteError !== null || ferdigstilteError !== null) {
    return (
      <LoadingError>
        <BodyLong>Feil ved lasting av data:</BodyLong>
        <List>
          {ledigeError === null ? null : <List.Item>{ledigeError}</List.Item>}
          {tildelteError === null ? null : <List.Item>{tildelteError}</List.Item>}
          {ferdigstilteError === null ? null : <List.Item>{ferdigstilteError}</List.Item>}
        </List>
      </LoadingError>
    );
  }

  return (
    <BehandlingerData
      ledige={ledige.behandlinger}
      tildelte={tildelte.behandlinger}
      ferdigstilte={ferdigstilte.behandlinger}
    />
  );
};

const BehandlingerData = ({
  ledige,
  tildelte,
  ferdigstilte,
}: {
  ledige: LedigBehandling[];
  tildelte: TildeltBehandling[];
  ferdigstilte: FerdigstiltBehandling[];
}) => {
  const [tildelingFilter] = useQueryState(QueryParam.TILDELING, parseAsLedigeFilter);

  const behandlinger = useMemo(() => {
    if (tildelingFilter === TildelingFilter.LEDIGE) {
      return [...ledige, ...ferdigstilte];
    }

    if (tildelingFilter === TildelingFilter.TILDELTE) {
      return [...tildelte, ...ferdigstilte];
    }

    return [...ledige, ...tildelte, ...ferdigstilte];
  }, [tildelingFilter, ledige, tildelte, ferdigstilte]);

  const filtered = useSaksstrøm(behandlinger);

  return (
    <ChartsWrapper>
      <Card fullWidth span={3}>
        <AntallSakerInnTilKabalFerdigstiltIKabal
          title="'Antall saker inn til Kabal / ferdigstilt i Kabal per uke'"
          behandlinger={filtered}
          createBuckets={createWeekBuckets}
          getInBucketIndex={getWeekInBucketIndex}
          getOutBucketIndex={getWeekOutBucketIndex}
        />
      </Card>
      <Card fullWidth span={3}>
        <AntallSakerInnTilKabalFerdigstiltIKabal
          title="Antall saker inn til Kabal / ferdigstilt i Kabal per måned"
          behandlinger={filtered}
          createBuckets={createMonthBuckets}
          getInBucketIndex={getMonthInBucketIndex}
          getOutBucketIndex={getMonthOutBucketIndex}
        />
      </Card>
    </ChartsWrapper>
  );
};

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

const createWeekBuckets = (from: Date, to: Date) => {
  const buckets: Buckets = {};

  for (let i = 0, t = from.valueOf(); t <= to.valueOf(); t += WEEK_IN_MS, i++) {
    buckets[i] = { inn: 0, ut: 0, label: getWeekLabel(new Date(t), to) };
  }

  return buckets;
};

const getWeekLabel = (date: Date, toDate: Date) => {
  const from = format(date, PRETTY_DATE_FORMAT);
  const weekEnd = subDays(date.valueOf() + WEEK_IN_MS, 1);
  const to = format(min([weekEnd, toDate]), PRETTY_DATE_FORMAT);

  return `${from} - ${to}`;
};

const createMonthBuckets = (from: Date, to: Date) =>
  eachMonthOfInterval({ start: from, end: to }).reduce<Buckets>((acc, date, index) => {
    acc[index] = { inn: 0, ut: 0, label: format(date, 'LLL yy', { locale: nb }) };

    return acc;
  }, {});

const getWeekInBucketIndex = (b: Behandling, from: Date): number => {
  const diffFromStart = new Date(b.created).valueOf() - from.valueOf();

  return Math.floor(diffFromStart / WEEK_IN_MS);
};

const getWeekOutBucketIndex = (b: FerdigstiltBehandling, from: Date): number => {
  const diffFromStart = new Date(b.avsluttetAvSaksbehandlerDate).valueOf() - from.valueOf();

  return Math.floor(diffFromStart / WEEK_IN_MS);
};

const getMonthInBucketIndex = (b: Behandling, from: Date) => differenceInMonths(new Date(b.created), from);

const getMonthOutBucketIndex = (b: FerdigstiltBehandling, from: Date) =>
  differenceInMonths(new Date(b.avsluttetAvSaksbehandlerDate), from);
