'use client';

import { BodyLong, List } from '@navikt/ds-react';
import {
  addDays,
  differenceInCalendarMonths,
  differenceInWeeks,
  eachMonthOfInterval,
  endOfDay,
  format,
  min,
  parse,
  startOfDay,
} from 'date-fns';
import { nb } from 'date-fns/locale';
import { useMemo } from 'react';
import { TildelingFilter } from '@/app/query-types';
import { SkeletonSaksstrøm } from '@/app/saksstroem/skeleton';
import { Card } from '@/components/cards';
import { BelastningPerYtelse } from '@/components/charts/belastning-per-ytelse';
import { LoadingError } from '@/components/charts/common/loading-error';
import {
  getRestanseAfterDate,
  useAktiveFiltered,
  useFerdigstiltInPeriod,
  useMottattInPeriod,
} from '@/components/charts/common/use-data';
import { useDateFilter } from '@/components/charts/common/use-date-filter';
import { AntallSakerInnTilKabalFerdigstiltIKabal, type Buckets } from '@/components/charts/inngang-utgang';
import { RestanseOverTid } from '@/components/charts/restanse-over-tid';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { useClientKapteinApiFetch } from '@/lib/client/use-client-fetch';
import { ISO_DATE_FORMAT, ISO_DATE_TIME_FORMAT, PRETTY_DATE_FORMAT } from '@/lib/date';
import { useTildelingFilter } from '@/lib/query-state/query-state';
import type {
  AnkerFerdigstilteResponse,
  AnkerLedigeResponse,
  AnkerTildelteResponse,
  Avsluttet,
  BaseBehandling,
  BegjæringOmGjenopptakFerdigstilteResponse,
  BegjæringOmGjenopptakLedigeResponse,
  BegjæringOmGjenopptakTildelteResponse,
  BetongFerdigstilteResponse,
  BetongLedigeResponse,
  BetongTildelteResponse,
  IYtelse,
  KlagerFerdigstilteResponse,
  KlagerLedigeResponse,
  KlagerTildelteResponse,
  Ledig,
  OmgjøringskravFerdigstilteResponse,
  OmgjøringskravLedigeResponse,
  OmgjøringskravTildelteResponse,
  Tildelt,
} from '@/lib/types';

interface KodeverkProps {
  ytelser: IYtelse[];
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
export const Behandlinger = (kodeverk: KodeverkProps) => {
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
  const {
    data: ledigeGb,
    isLoading: isLoadingLedigeGb,
    error: errorLedigeGb,
  } = useClientKapteinApiFetch<BegjæringOmGjenopptakLedigeResponse>('/begjaeringer-om-gjenopptak/ledige');
  const {
    data: tildelteGb,
    isLoading: isLoadingTildelteGb,
    error: errorTildelteGb,
  } = useClientKapteinApiFetch<BegjæringOmGjenopptakTildelteResponse>('/begjaeringer-om-gjenopptak/tildelte');
  const {
    data: ferdigstilteGb,
    isLoading: isLoadingFerdigstilteGb,
    error: errorFerdigstilteGb,
  } = useClientKapteinApiFetch<BegjæringOmGjenopptakFerdigstilteResponse>('/begjaeringer-om-gjenopptak/ferdigstilte');

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
    omgjøringskravFerdigstilteLoading ||
    isLoadingLedigeGb ||
    isLoadingTildelteGb ||
    isLoadingFerdigstilteGb
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
    omgjøringskravFerdigstilteError !== null ||
    errorLedigeGb !== null ||
    errorTildelteGb !== null ||
    errorFerdigstilteGb !== null
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
          {errorLedigeGb === null ? null : <List.Item>{errorLedigeGb}</List.Item>}
          {errorTildelteGb === null ? null : <List.Item>{errorTildelteGb}</List.Item>}
          {errorFerdigstilteGb === null ? null : <List.Item>{errorFerdigstilteGb}</List.Item>}
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
        ...ledigeGb.behandlinger,
      ]}
      tildelte={[
        ...klagerTildelte.behandlinger,
        ...ankerTildelte.behandlinger,
        ...betongTildelte.behandlinger,
        ...omgjøringskravTildelte.behandlinger,
        ...tildelteGb.behandlinger,
      ]}
      ferdigstilte={[
        ...klagerFerdigstilte.behandlinger,
        ...ankerFerdigstilte.behandlinger,
        ...betongFerdigstilte.behandlinger,
        ...omgjøringskravFerdigstilte.behandlinger,
        ...ferdigstilteGb.behandlinger,
      ]}
      {...kodeverk}
    />
  );
};

interface DataProps extends KodeverkProps {
  ledige: (BaseBehandling & Ledig)[];
  tildelte: (BaseBehandling & Tildelt)[];
  ferdigstilte: (BaseBehandling & Avsluttet)[];
}

const BehandlingerData = ({ ledige, tildelte, ferdigstilte, ytelser }: DataProps) => {
  const { toFilter } = useDateFilter();
  const [tildelingFilter] = useTildelingFilter();

  const uferdige = useMemo(() => {
    if (tildelingFilter === TildelingFilter.LEDIGE) {
      return ledige;
    }

    if (tildelingFilter === TildelingFilter.TILDELTE) {
      return tildelte;
    }

    return [...ledige, ...tildelte];
  }, [tildelingFilter, ledige, tildelte]);

  const ferdigstilteBaseFiltered = useAktiveFiltered(ferdigstilte);
  const uferdigeBaseFiltered = useAktiveFiltered(uferdige);

  const ferdigstilteInPeriod = useFerdigstiltInPeriod(ferdigstilteBaseFiltered);
  const mottattInPeriod = useMottattInPeriod(uferdigeBaseFiltered);

  const restanseAfterToDate = getRestanseAfterDate(uferdigeBaseFiltered, ferdigstilteBaseFiltered, toFilter);

  return (
    <ChartsWrapper>
      <Card fullWidth span={5}>
        <BelastningPerYtelse
          title="Belastning per ytelse"
          helpText={
            <BodyLong>
              Viser om restansene har økt eller minket innenfor valgt periode per ytelse. Viser antall saker mottatt og
              antall saker ferdigstilt i valgt periode. Dersom det er mottatt flere saker enn det er ferdigstilt, vises
              endringen i restanse som <code>+</code> og er markert i rødt. Dersom det er mottatt færre saker enn det er
              ferdigstilt, vises endringen i restanse som <code>-</code> og er markert i grønn skravering.
            </BodyLong>
          }
          ferdigstilteInPeriod={ferdigstilteInPeriod}
          mottattInPeriod={mottattInPeriod}
          outgoingRestanse={restanseAfterToDate}
          ytelser={ytelser}
        />
      </Card>
      <Card fullWidth span={3}>
        <RestanseOverTid
          title="Restanse over tid"
          helpText={
            <>
              <BodyLong spacing>
                Viser hvordan restansene utvikler seg over tid. Restanse ved periodestart er antall aktive saker på
                første dato i valgt periode. Restanse ved periodeslutt er antall aktive saker på siste dato i valgt
                periode. Dersom det er mottatt flere saker enn det er ferdigstilt, vises endringen i restanse som{' '}
                <code>+</code>. Dersom det er mottatt færre saker enn det er ferdigstilt, vises endringen i restanse som{' '}
                <code>-</code>.
              </BodyLong>
              <BodyLong>
                I X-aksen vises antall aktive saker per tidspunkt, slik at du kan se hvordan restansen endrer seg over
                tid.
              </BodyLong>
            </>
          }
          ferdigstilte={ferdigstilteBaseFiltered}
          uferdige={uferdigeBaseFiltered}
          ytelser={ytelser}
        />
      </Card>
      <Card fullWidth span={3}>
        <AntallSakerInnTilKabalFerdigstiltIKabal
          title="Antall saker mottatt / ferdigstilt i Kabal per uke"
          helpText={
            <BodyLong>
              Viser antall saker mottatt og antall saker ferdigstilt per uke i valgt periode. Dersom det er mottatt
              flere saker enn det er ferdigstilt, vises endringen i restanse som <code>+</code> og er markert i rødt.
              Dersom det er mottatt færre saker enn det er ferdigstilt, vises endringen i restanse som <code>-</code> og
              er markert i grønt.
            </BodyLong>
          }
          ferdigstilte={ferdigstilteInPeriod}
          uferdigeList={mottattInPeriod}
          createBuckets={createWeekBuckets}
          getInBucketIndex={getWeekInBucketIndex}
          getOutBucketIndex={getWeekOutBucketIndex}
        />
      </Card>
      <Card fullWidth span={3}>
        <AntallSakerInnTilKabalFerdigstiltIKabal
          title="Antall saker mottatt / ferdigstilt i Kabal per måned"
          helpText={
            <BodyLong>
              Viser antall saker mottatt og antall saker ferdigstilt per måned i valgt periode. Dersom det er mottatt
              flere saker enn det er ferdigstilt, vises endringen i restanse som <code>+</code> og er markert i rødt.
              Dersom det er mottatt færre saker enn det er ferdigstilt, vises endringen i restanse som <code>-</code> og
              er markert i grønt.
            </BodyLong>
          }
          ferdigstilte={ferdigstilteInPeriod}
          uferdigeList={mottattInPeriod}
          createBuckets={createMonthBuckets}
          getInBucketIndex={getMonthInBucketIndex}
          getOutBucketIndex={getMonthOutBucketIndex}
        />
      </Card>
    </ChartsWrapper>
  );
};

const createWeekBuckets = (from: string, to: string) => {
  const buckets: Buckets = {};

  let currentDateTime = format(startOfDay(from), ISO_DATE_TIME_FORMAT);
  let weekNumber = 0;

  const endDateTime = format(endOfDay(to), ISO_DATE_TIME_FORMAT);

  while (currentDateTime <= endDateTime) {
    const endOfWeek = format(min([addDays(currentDateTime, 6), endDateTime]), ISO_DATE_TIME_FORMAT);

    buckets[weekNumber] = { inn: 0, ut: 0, label: getWeekLabel(currentDateTime, endOfWeek) };
    weekNumber += 1;

    const firstDayInNextWeek = format(addDays(endOfWeek, 1), ISO_DATE_TIME_FORMAT);
    currentDateTime = firstDayInNextWeek;
  }

  return buckets;
};

const getWeekLabel = (start: string, end: string) => {
  const from = format(start, PRETTY_DATE_FORMAT);
  const to = format(end, PRETTY_DATE_FORMAT);

  return `${from} - ${to}`;
};

const createMonthBuckets = (from: string, to: string) => {
  const monthStarts = eachMonthOfInterval({ start: from, end: to });

  const buckets: Buckets = {};

  for (const monthStart of monthStarts) {
    const relativeMonthNumber = differenceInCalendarMonths(monthStart, parse(from, ISO_DATE_FORMAT, new Date()));

    buckets[relativeMonthNumber] = { inn: 0, ut: 0, label: format(monthStart, 'LLL yy', { locale: nb }) };
  }

  return buckets;
};

const getWeekInBucketIndex = (b: BaseBehandling, from: string): number =>
  differenceInWeeks(
    parse(b.mottattKlageinstans, ISO_DATE_FORMAT, new Date()),
    parse(from, ISO_DATE_FORMAT, new Date()),
  );

const getWeekOutBucketIndex = (b: Avsluttet, from: string): number =>
  differenceInWeeks(
    parse(b.avsluttetAvSaksbehandlerDate, ISO_DATE_FORMAT, new Date()),
    parse(from, ISO_DATE_FORMAT, new Date()),
  );

const getMonthInBucketIndex = (b: BaseBehandling, from: string) =>
  differenceInCalendarMonths(
    parse(b.mottattKlageinstans, ISO_DATE_FORMAT, new Date()),
    parse(from, ISO_DATE_FORMAT, new Date()),
  );

const getMonthOutBucketIndex = (b: Avsluttet, from: string) =>
  differenceInCalendarMonths(
    parse(b.avsluttetAvSaksbehandlerDate, ISO_DATE_FORMAT, new Date()),
    parse(from, ISO_DATE_FORMAT, new Date()),
  );
