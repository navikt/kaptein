'use client';

import { BodyLong, List } from '@navikt/ds-react';
import { differenceInMonths, differenceInWeeks, eachMonthOfInterval, format, min, subDays } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { parseAsLedigeFilter } from '@/app/custom-query-parsers';
import { TildelingFilter } from '@/app/query-types';
import { Card } from '@/components/cards';
import { Aldersfordeling } from '@/components/charts/alder-histogram';
import { LoadingError } from '@/components/charts/common/loading-error';
import { SkeletonSaksstrøm } from '@/components/charts/common/skeleton-chart';
import { useFerdigstiltSaksstrøm, useUferdigeSaksstrøm } from '@/components/charts/common/use-data';
import { AntallSakerInnTilKabalFerdigstiltIKabal, type Buckets } from '@/components/charts/inngang-utgang';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { useClientKapteinApiFetch } from '@/lib/client/use-client-fetch';
import { PRETTY_DATE_FORMAT } from '@/lib/date';
import type {
  AnkerFerdigstilteResponse,
  AnkerLedigeResponse,
  AnkerTildelteResponse,
  BaseBehandling,
  BetongFerdigstilteResponse,
  BetongLedigeResponse,
  BetongTildelteResponse,
  Ferdigstilt,
  KlagerFerdigstilteResponse,
  KlagerLedigeResponse,
  KlagerTildelteResponse,
  Ledig,
  OmgjøringskravFerdigstilteResponse,
  OmgjøringskravLedigeResponse,
  OmgjøringskravTildelteResponse,
  Tildelt,
} from '@/lib/types';
import { QueryParam } from '@/lib/types/query-param';

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
export const Behandlinger = () => {
  const {
    data: klagerLedige,
    error: klagerLedigeError,
    isLoading: klagerLedigeLoading,
  } = useClientKapteinApiFetch<KlagerLedigeResponse>('/klager/ledige');
  const {
    data: klagerTildelte,
    error: klagerTildelteError,
    isLoading: klagerTildelteLoading,
  } = useClientKapteinApiFetch<KlagerTildelteResponse>('/klager/tildelte');
  const {
    data: klagerFerdigstilte,
    isLoading: klagerFerdigstilteLoading,
    error: klagerFerdigstilteError,
  } = useClientKapteinApiFetch<KlagerFerdigstilteResponse>('/klager/ferdigstilte');
  const {
    data: ankerLedige,
    error: ankerLedigeError,
    isLoading: ankerLedigeLoading,
  } = useClientKapteinApiFetch<AnkerLedigeResponse>('/anker/ledige');
  const {
    data: ankerTildelte,
    error: ankerTildelteError,
    isLoading: ankerTildelteLoading,
  } = useClientKapteinApiFetch<AnkerTildelteResponse>('/anker/tildelte');
  const {
    data: ankerFerdigstilte,
    isLoading: ankerFerdigstilteLoading,
    error: ankerFerdigstilteError,
  } = useClientKapteinApiFetch<AnkerFerdigstilteResponse>('/anker/ferdigstilte');
  const {
    data: betongLedige,
    error: betongLedigeError,
    isLoading: betongLedigeLoading,
  } = useClientKapteinApiFetch<BetongLedigeResponse>('/behandlinger-etter-tr-opphevet/ledige');
  const {
    data: betongTildelte,
    error: betongTildelteError,
    isLoading: betongTildelteLoading,
  } = useClientKapteinApiFetch<BetongTildelteResponse>('/behandlinger-etter-tr-opphevet/tildelte');
  const {
    data: betongFerdigstilte,
    isLoading: betongFerdigstilteLoading,
    error: betongFerdigstilteError,
  } = useClientKapteinApiFetch<BetongFerdigstilteResponse>('/behandlinger-etter-tr-opphevet/ferdigstilte');
  const {
    data: omgjøringskravLedige,
    error: omgjøringskravLedigeError,
    isLoading: omgjøringskravLedigeLoading,
  } = useClientKapteinApiFetch<OmgjøringskravLedigeResponse>('/omgjoeringskrav/ledige');
  const {
    data: omgjøringskravTildelte,
    error: omgjøringskravTildelteError,
    isLoading: omgjøringskravTildelteLoading,
  } = useClientKapteinApiFetch<OmgjøringskravTildelteResponse>('/omgjoeringskrav/tildelte');
  const {
    data: omgjøringskravFerdigstilte,
    isLoading: omgjøringskravFerdigstilteLoading,
    error: omgjøringskravFerdigstilteError,
  } = useClientKapteinApiFetch<OmgjøringskravFerdigstilteResponse>('/omgjoeringskrav/ferdigstilte');

  if (
    klagerLedigeLoading ||
    klagerTildelteLoading ||
    klagerFerdigstilteLoading ||
    ankerLedigeLoading ||
    ankerTildelteLoading ||
    ankerFerdigstilteLoading ||
    betongLedigeLoading ||
    betongTildelteLoading ||
    betongFerdigstilteLoading ||
    omgjøringskravLedigeLoading ||
    omgjøringskravTildelteLoading ||
    omgjøringskravFerdigstilteLoading
  ) {
    return <SkeletonSaksstrøm />;
  }

  if (
    klagerLedigeError !== null ||
    klagerTildelteError !== null ||
    klagerFerdigstilteError !== null ||
    ankerLedigeError !== null ||
    ankerTildelteError !== null ||
    ankerFerdigstilteError !== null ||
    betongLedigeError !== null ||
    betongTildelteError !== null ||
    betongFerdigstilteError !== null ||
    omgjøringskravLedigeError !== null ||
    omgjøringskravTildelteError !== null ||
    omgjøringskravFerdigstilteError !== null
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
          {betongLedigeError === null ? null : <List.Item>{betongLedigeError}</List.Item>}
          {betongTildelteError === null ? null : <List.Item>{betongTildelteError}</List.Item>}
          {betongFerdigstilteError === null ? null : <List.Item>{betongFerdigstilteError}</List.Item>}
          {omgjøringskravLedigeError === null ? null : <List.Item>{omgjøringskravLedigeError}</List.Item>}
          {omgjøringskravTildelteError === null ? null : <List.Item>{omgjøringskravTildelteError}</List.Item>}
          {omgjøringskravFerdigstilteError === null ? null : <List.Item>{omgjøringskravFerdigstilteError}</List.Item>}
        </List>
      </LoadingError>
    );
  }

  return (
    <BehandlingerData
      ledige={[
        ...klagerLedige.behandlinger,
        ...ankerLedige.behandlinger,
        ...betongLedige.behandlinger,
        ...omgjøringskravLedige.behandlinger,
      ]}
      tildelte={[
        ...klagerTildelte.behandlinger,
        ...ankerTildelte.behandlinger,
        ...betongTildelte.behandlinger,
        ...omgjøringskravTildelte.behandlinger,
      ]}
      ferdigstilte={[
        ...klagerFerdigstilte.behandlinger,
        ...ankerFerdigstilte.behandlinger,
        ...betongFerdigstilte.behandlinger,
        ...omgjøringskravFerdigstilte.behandlinger,
      ]}
    />
  );
};

const BehandlingerData = ({
  ledige,
  tildelte,
  ferdigstilte,
}: {
  ledige: (BaseBehandling & Ledig)[];
  tildelte: (BaseBehandling & Tildelt)[];
  ferdigstilte: (BaseBehandling & Ferdigstilt)[];
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
          title="Antall saker inn til Kabal / ferdigstilt i Kabal per uke"
          ferdigstilte={ferdigstilteFiltered}
          uferdigeList={uferdigeFiltered}
          createBuckets={createWeekBuckets}
          getInBucketIndex={getWeekInBucketIndex}
          getOutBucketIndex={getWeekOutBucketIndex}
        />
      </Card>
      <Card fullWidth span={3}>
        <AntallSakerInnTilKabalFerdigstiltIKabal
          title="Antall saker inn til Kabal / ferdigstilt i Kabal per måned"
          ferdigstilte={ferdigstilteFiltered}
          uferdigeList={uferdigeFiltered}
          createBuckets={createMonthBuckets}
          getInBucketIndex={getMonthInBucketIndex}
          getOutBucketIndex={getMonthOutBucketIndex}
        />
      </Card>
      <Card fullWidth span={4}>
        <Aldersfordeling uferdigeList={uferdigeFiltered} />
      </Card>
    </ChartsWrapper>
  );
};

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

const createWeekBuckets = (from: Date, to: Date) => {
  const buckets: Buckets = {};

  for (let i = 0, t = from.getTime(); t <= to.getTime(); t += WEEK_IN_MS, i++) {
    buckets[i] = { inn: 0, ut: 0, uferdige: 0, label: getWeekLabel(new Date(t), to) };
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
    acc[index] = { inn: 0, ut: 0, uferdige: 0, label: format(date, 'LLL yy', { locale: nb }) };

    return acc;
  }, {});

const getWeekInBucketIndex = (b: BaseBehandling, from: Date): number => differenceInWeeks(b.created, from);

const getWeekOutBucketIndex = (b: Ferdigstilt, from: Date): number =>
  differenceInWeeks(b.avsluttetAvSaksbehandlerDate, from);

const getMonthInBucketIndex = (b: BaseBehandling, from: Date) => differenceInMonths(b.created, from);

const getMonthOutBucketIndex = (b: Ferdigstilt, from: Date) => differenceInMonths(b.avsluttetAvSaksbehandlerDate, from);
