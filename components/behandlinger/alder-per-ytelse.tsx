'use client';

import { VStack } from '@navikt/ds-react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import {
  COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
  COMMON_STACKED_BAR_CHART_PROPS,
} from '@/components/behandlinger/common-chart-props';
import { DayPicker } from '@/components/behandlinger/day-picker';
import { Age, getAgeColor } from '@/components/behandlinger/use-frist-color';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling, IKodeverkSimpleValue } from '@/lib/server/types';
import { QueryParam } from '@/lib/types/query-param';

interface Props {
  behandlinger: Behandling[];
  relevantYtelser: IKodeverkSimpleValue[];
}

const TITLE = 'Alder per ytelse';

const getData = (behandling: Behandling, age: Age, maxAge: number): number => {
  switch (age) {
    case Age.OLDER:
      return behandling.ageKA !== null && behandling.ageKA >= maxAge ? 1 : 0;
    case Age.YOUNGER:
      return behandling.ageKA !== null && behandling.ageKA < maxAge ? 1 : 0;
  }
};

export const AlderPerYtelse = ({ behandlinger, relevantYtelser }: Props) => {
  const [maxAge, setMaxAge] = useQueryState(QueryParam.ALDER_PER_YTELSE_MAX_DAYS, parseAsInteger);

  const series = useMemo(
    () =>
      Object.values(Age).map((type) => ({
        ...COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
        name: type,
        color: getAgeColor(type),
        data: relevantYtelser
          .map(({ id }) =>
            behandlinger.reduce(
              (acc, curr) => (curr.ytelseId === id ? acc + getData(curr, type, maxAge ?? 0) : acc),
              0,
            ),
          )
          .map((value) => (value === 0 ? null : value)),
      })),
    [behandlinger, relevantYtelser, maxAge],
  );

  if (behandlinger.length === 0) {
    return <NoData title={TITLE} />;
  }

  const labels = relevantYtelser.map(
    (y, i) => `${y.navn} (${series.reduce((acc, curr) => acc + (curr.data[i] ?? 0), 0)})`,
  );

  return (
    <VStack justify="center" align="center" gap="4" className="h-full">
      <DayPicker value={maxAge} setValue={setMaxAge} title="Alder" options={DAY_PICKER_OPTIONS} />
      <EChart
        height="auto"
        className="grow"
        option={{
          ...COMMON_STACKED_BAR_CHART_PROPS,
          title: { text: TITLE, subtext: `Viser data for ${behandlinger.length} saker` },
          yAxis: { type: 'category', data: labels },
          series,
        }}
      />
    </VStack>
  );
};

const DAY_PICKER_OPTIONS = [
  {
    numDays: 12 * 7,
    label: '12 uker',
  },
  {
    numDays: 15 * 7,
    label: '15 uker',
  },
];
