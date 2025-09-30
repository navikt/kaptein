'use client';

import { BodyLong, List } from '@navikt/ds-react';
import { differenceInMonths, differenceInWeeks, eachMonthOfInterval, format, min, subDays } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { parseAsLedigeFilter } from '@/app/custom-query-parsers';
import { TildelingFilter } from '@/app/query-types';
import { Card } from '@/components/cards';
import { LoadingError } from '@/components/charts/common/loading-error';
import { SkeletonFerdigstilte } from '@/components/charts/common/skeleton-chart';
import { useFerdigstiltSaksstrøm, useUferdigeSaksstrøm } from '@/components/charts/common/use-data';
import { AntallSakerInnTilKabalFerdigstiltIKabal, type Buckets } from '@/components/charts/inngang-utgang';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { useClientFetch } from '@/lib/client/use-client-fetch';
import { PRETTY_DATE_FORMAT } from '@/lib/date';
import type {
  AnkeFerdigstilt,
  AnkeLedig,
  AnkerFerdigstilteResponse,
  AnkerLedigeResponse,
  AnkerTildelteResponse,
  AnkeTildelt,
  BaseBehandling,
  Ferdigstilt,
  KlageFerdigstilt,
  KlageLedig,
  KlagerFerdigstilteResponse,
  KlagerLedigeResponse,
  KlagerTildelteResponse,
  KlageTildelt,
} from '@/lib/types';
import { QueryParam } from '@/lib/types/query-param';

export const Behandlinger = () => {
  const {
    data: klagerLedige,
    error: klagerLedigeError,
    isLoading: klagerLedigeLoading,
  } = useClientFetch<KlagerLedigeResponse>('/api/klager/ledige');
  const {
    data: klagerTildelte,
    error: klagerTildelteError,
    isLoading: klagerTildelteLoading,
  } = useClientFetch<KlagerTildelteResponse>('/api/klager/tildelte');
  const {
    data: klagerFerdigstilte,
    isLoading: klagerFerdigstilteLoading,
    error: klagerFerdigstilteError,
  } = useClientFetch<KlagerFerdigstilteResponse>('/api/klager/ferdigstilte');
  const {
    data: ankerLedige,
    error: ankerLedigeError,
    isLoading: ankerLedigeLoading,
  } = useClientFetch<AnkerLedigeResponse>('/api/anker/ledige');
  const {
    data: ankerTildelte,
    error: ankerTildelteError,
    isLoading: ankerTildelteLoading,
  } = useClientFetch<AnkerTildelteResponse>('/api/anker/tildelte');
  const {
    data: ankerFerdigstilte,
    isLoading: ankerFerdigstilteLoading,
    error: ankerFerdigstilteError,
  } = useClientFetch<AnkerFerdigstilteResponse>('/api/anker/ferdigstilte');

  if (
    klagerLedigeLoading ||
    klagerTildelteLoading ||
    klagerFerdigstilteLoading ||
    ankerLedigeLoading ||
    ankerTildelteLoading ||
    ankerFerdigstilteLoading
  ) {
    return <SkeletonFerdigstilte />;
  }

  if (
    klagerLedigeError !== null ||
    klagerTildelteError !== null ||
    klagerFerdigstilteError !== null ||
    ankerLedigeError !== null ||
    ankerTildelteError !== null ||
    ankerFerdigstilteError !== null
  ) {
    return (
      <LoadingError>
        <BodyLong>Feil ved lasting av data:</BodyLong>
        <List>
          {klagerLedigeError === null ? null : <List.Item>{klagerLedigeError}</List.Item>}
          {klagerTildelteError === null ? null : <List.Item>{klagerTildelteError}</List.Item>}
          {klagerFerdigstilteError === null ? null : <List.Item>{klagerFerdigstilteError}</List.Item>}
          {ankerLedigeError === null ? null : <List.Item>{ankerLedigeError}</List.Item>}
          {ankerTildelteError === null ? null : <List.Item>{ankerTildelteError}</List.Item>}
          {ankerFerdigstilteError === null ? null : <List.Item>{ankerFerdigstilteError}</List.Item>}
        </List>
      </LoadingError>
    );
  }

  return (
    <BehandlingerData
      ledige={klagerLedige.behandlinger.concat(ankerLedige.behandlinger)}
      tildelte={klagerTildelte.behandlinger.concat(ankerTildelte.behandlinger)}
      ferdigstilte={klagerFerdigstilte.behandlinger.concat(ankerFerdigstilte.behandlinger)}
    />
  );
};

const BehandlingerData = ({
  ledige,
  tildelte,
  ferdigstilte,
}: {
  ledige: (KlageLedig | AnkeLedig)[];
  tildelte: (KlageTildelt | AnkeTildelt)[];
  ferdigstilte: (KlageFerdigstilt | AnkeFerdigstilt)[];
}) => {
  const [tildelingFilter] = useQueryState(QueryParam.TILDELING, parseAsLedigeFilter);

  const uferdige = useMemo(() => {
    if (tildelingFilter === TildelingFilter.LEDIGE) {
      return ledige;
    }

    if (tildelingFilter === TildelingFilter.TILDELTE) {
      return tildelte;
    }

    return [...ledige, ...tildelte];
  }, [tildelingFilter, ledige, tildelte]);

  const ferdigstilteFiltered = useFerdigstiltSaksstrøm(ferdigstilte);
  const uferdigeFiltered = useUferdigeSaksstrøm(uferdige);

  return (
    <ChartsWrapper>
      <Card fullWidth span={3}>
        <AntallSakerInnTilKabalFerdigstiltIKabal
          title="'Antall saker inn til Kabal / ferdigstilt i Kabal per uke'"
          ferdigstilte={ferdigstilteFiltered}
          uferdige={uferdigeFiltered}
          createBuckets={createWeekBuckets}
          getInBucketIndex={getWeekInBucketIndex}
          getOutBucketIndex={getWeekOutBucketIndex}
        />
      </Card>
      <Card fullWidth span={3}>
        <AntallSakerInnTilKabalFerdigstiltIKabal
          title="Antall saker inn til Kabal / ferdigstilt i Kabal per måned"
          ferdigstilte={ferdigstilteFiltered}
          uferdige={uferdigeFiltered}
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

  for (let i = 0, t = from.getTime(); t <= to.getTime(); t += WEEK_IN_MS, i++) {
    buckets[i] = { inn: 0, ut: 0, label: getWeekLabel(new Date(t), to) };
  }

  return buckets;
};

const getWeekLabel = (date: Date, toDate: Date) => {
  const from = format(date, PRETTY_DATE_FORMAT);
  const weekEnd = subDays(date.getTime() + WEEK_IN_MS, 1);
  const to = format(min([weekEnd, toDate]), PRETTY_DATE_FORMAT);

  return `${from} - ${to}`;
};

const createMonthBuckets = (from: Date, to: Date) =>
  eachMonthOfInterval({ start: from, end: to }).reduce<Buckets>((acc, date, index) => {
    acc[index] = { inn: 0, ut: 0, label: format(date, 'LLL yy', { locale: nb }) };

    return acc;
  }, {});

const getWeekInBucketIndex = (b: BaseBehandling, from: Date): number => differenceInWeeks(b.created, from);

const getWeekOutBucketIndex = (b: Ferdigstilt, from: Date): number =>
  differenceInWeeks(b.avsluttetAvSaksbehandlerDate, from);

const getMonthInBucketIndex = (b: BaseBehandling, from: Date) => differenceInMonths(b.created, from);

const getMonthOutBucketIndex = (b: Ferdigstilt, from: Date) => differenceInMonths(b.avsluttetAvSaksbehandlerDate, from);
